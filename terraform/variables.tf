variable "project_name" {
  description = ""
  type        = string
}

variable "Environment" {
  description = ""
  type        = string
}

variable "cidr_block" {
  description = ""
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = ""
  type        = string
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidr" {
  description = ""
  type        = string
  default     = ["10.0.10.0/24", "10.0.11.0/24"]
}

variable "availability_zones" {
  description = ""
  type        = string
  default     = ["us-east-1a", "us-east-1b"]
}