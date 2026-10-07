# OpenNext single-zone deployment: S3 (assets + cache), CloudFront, the server
# Lambda, the image-optimisation Lambda, the SQS revalidation queue + Lambda,
# and the DynamoDB tag cache — all derived from web/.open-next.
module "open_next" {
  # Vendored copy of RJPearson94/open-next v3.7.1 with a one-line patch to the
  # Lambda function-URL permission (see terraform/vendor/README.md). Using a
  # local source makes the patch reproducible in CI.
  source = "./vendor/terraform-aws-open-next/modules/tf-aws-open-next-zone"

  prefix      = "dum"
  folder_path = "${path.module}/../web/.open-next"

  # Built with OpenNext v4, whose output.json uses the v3 single-zone schema
  # (origins/behaviours/additionalProps) this module understands.
  open_next_version = "v3.x.x"

  # No CloudFront continuous-deployment (staging distribution) — single prod
  # distribution is enough here.
  continuous_deployment = {
    use = false
  }

  domain_config = {
    sub_domain = "dum"
    # Let the module look the zone up by name (passing `id` here trips a
    # coalesce/index bug in the module's public-resources submodule).
    hosted_zones = [{
      name = var.root_domain
    }]
    create_route53_entries = true
    viewer_certificate = {
      acm_certificate_arn = aws_acm_certificate_validation.site.certificate_arn
    }
  }

  providers = {
    aws.server_function = aws.server_function
    aws.iam             = aws.iam
    aws.dns             = aws.dns
    aws.global          = aws.global
  }
}
