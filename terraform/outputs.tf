output "site_url" {
  description = "Public URL of the deployed app."
  value       = "https://${var.site_domain}"
}

output "deploy_role_arn" {
  description = "IAM role for GitHub Actions — set as the AWS_DEPLOY_ROLE_ARN repo variable."
  value       = aws_iam_role.deploy.arn
}

output "cloudfront_url" {
  description = "CloudFront distribution URL from the open-next module."
  value       = try(module.open_next.cloudfront_url, null)
}
