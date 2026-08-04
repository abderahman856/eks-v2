module "vpc" {
  source              = "./vpc"
  project_name        = var.project_name
  Environment         = var.Environment
  cidr_block          = var.cidr_block
  private_subnet_cidr = var.private_subnet_cidr
  public_subnet_cidrs = var.public_subnet_cidrs
  availability_zones  = var.availability_zones
}

terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}