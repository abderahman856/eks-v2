module "vpc" {
  source              = "./vpc"
  project_name        = var.project_name
  Environment         = var.Environment
  cidr_block          = var.cidr_block
  private_subnet_cidr = var.private_subnet_cidr
  public_subnet_cidrs = var.public_subnet_cidrs
  availability_zones  = var.availability_zones
}