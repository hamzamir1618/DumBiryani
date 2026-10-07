variable "aws_region" {
  description = "Region for all resources. us-east-1 so the CloudFront ACM cert is co-located."
  type        = string
  default     = "us-east-1"
}

variable "root_domain" {
  description = "Route 53 hosted zone apex."
  type        = string
  default     = "meredianandco.com"
}

variable "site_domain" {
  description = "Fully-qualified subdomain the app is served at."
  type        = string
  default     = "dum.meredianandco.com"
}

variable "github_owner" {
  description = "GitHub org that owns the repo (OIDC trust subject)."
  type        = string
  default     = "exerra-ai-org"
}

variable "github_repo" {
  description = "Repository name (OIDC trust subject)."
  type        = string
  default     = "DUM"
}

# This GitHub org customizes the OIDC subject claim to include numeric org and
# repo IDs: repo:<owner>@<org_id>/<repo>@<repo_id>:... — the trust policy must
# match that form (see the existing exerra-deploy-* roles).
variable "github_org_id" {
  description = "Numeric GitHub org id used in the customized OIDC subject claim."
  type        = string
  default     = "226608819"
}

variable "github_repo_id" {
  description = "Numeric GitHub repo id used in the customized OIDC subject claim."
  type        = string
  default     = "1408742965"
}

variable "create_github_oidc_provider" {
  description = "Create the GitHub OIDC provider. False to reuse the one already in the account."
  type        = bool
  default     = false
}

variable "tags" {
  description = "Tags applied to all taggable resources."
  type        = map(string)
  default = {
    Project   = "dum"
    ManagedBy = "terraform"
  }
}
