terraform {
  required_version = ">= 1.10"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 6.29.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = ">= 2.4.0"
    }
    local = {
      source  = "hashicorp/local"
      version = ">= 2.4.0"
    }
  }

  # Remote state is required: both local applies and the GitHub Actions CD
  # (which runs `terraform apply`) share this state. S3 native locking
  # (use_lockfile) replaces the old DynamoDB lock table.
  backend "s3" {
    bucket       = "meredianandco-tfstate-637361978295"
    key          = "dum/terraform.tfstate"
    region       = "us-east-1"
    encrypt      = true
    use_lockfile = true
  }
}
