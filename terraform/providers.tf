# Everything runs in us-east-1: CloudFront's cert must be there (global), and
# keeping the Lambdas/S3/DynamoDB/SQS in the same region keeps the stack simple.
# The open-next module requires four aliased providers; for a single-region
# deployment they all point at us-east-1.
provider "aws" {
  region = var.aws_region

  default_tags {
    tags = var.tags
  }
}

provider "aws" {
  alias  = "server_function"
  region = var.aws_region
  default_tags {
    tags = var.tags
  }
}

provider "aws" {
  alias  = "iam"
  region = var.aws_region
  default_tags {
    tags = var.tags
  }
}

provider "aws" {
  alias  = "dns"
  region = var.aws_region
  default_tags {
    tags = var.tags
  }
}

# CloudFront / ACM for CloudFront is always us-east-1.
provider "aws" {
  alias  = "global"
  region = "us-east-1"
  default_tags {
    tags = var.tags
  }
}

data "aws_route53_zone" "root" {
  name         = "${var.root_domain}."
  private_zone = false
}
