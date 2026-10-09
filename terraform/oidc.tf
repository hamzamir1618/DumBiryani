# GitHub Actions authenticates with short-lived OIDC tokens. Because CD runs
# `terraform apply` for the full OpenNext stack, this role is intentionally
# broad (it manages Lambda, S3, CloudFront, SQS, DynamoDB and the IAM roles the
# module creates). It is still assumable ONLY by this repo's Actions.

data "aws_iam_openid_connect_provider" "github" {
  count = var.create_github_oidc_provider ? 0 : 1
  url   = "https://token.actions.githubusercontent.com"
}

resource "aws_iam_openid_connect_provider" "github" {
  count          = var.create_github_oidc_provider ? 1 : 0
  url            = "https://token.actions.githubusercontent.com"
  client_id_list = ["sts.amazonaws.com"]
  # GitHub's OIDC is validated via its CA; thumbprint is no longer enforced.
  thumbprint_list = ["ffffffffffffffffffffffffffffffffffffffff"]
}

locals {
  github_oidc_arn = var.create_github_oidc_provider ? aws_iam_openid_connect_provider.github[0].arn : data.aws_iam_openid_connect_provider.github[0].arn
}

data "aws_iam_policy_document" "deploy_assume" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]
    effect  = "Allow"

    principals {
      type        = "Federated"
      identifiers = [local.github_oidc_arn]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    # The org customizes the OIDC subject claim (org-id/repo-id form); match
    # both the standard and customized subjects, scoped to this repo.
    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      values = [
        "repo:${var.github_owner}/${var.github_repo}:*",
        "repo:${var.github_owner}@${var.github_org_id}/${var.github_repo}@${var.github_repo_id}:*",
      ]
    }
  }
}

resource "aws_iam_role" "deploy" {
  name                 = "${var.github_repo}-gha-deploy"
  assume_role_policy   = data.aws_iam_policy_document.deploy_assume.json
  max_session_duration = 3600
}

# Broad deploy permissions required to `terraform apply` the OpenNext stack.
data "aws_iam_policy_document" "deploy" {
  statement {
    sid    = "ManageOpenNextStack"
    effect = "Allow"
    actions = [
      "s3:*",
      "cloudfront:*",
      "lambda:*",
      "sqs:*",
      "dynamodb:*",
      "logs:*",
      "cloudwatch:*",
      "ssm:*",
      "acm:*",
      "route53:*",
      "iam:*",
      "application-autoscaling:*",
      "tag:*",
      "resource-groups:*",
      "sts:GetCallerIdentity",
    ]
    resources = ["*"]
  }
}

resource "aws_iam_role_policy" "deploy" {
  name   = "deploy"
  role   = aws_iam_role.deploy.id
  policy = data.aws_iam_policy_document.deploy.json
}
