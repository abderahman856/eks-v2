output "vpc_id" {
  description = ""
  value       = aws_vpc.my_vpc.id
}

output "public_subnet_ids" {
  description = ""
  value       = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  description = ""
  value       = aws_subnet.private[*].id
}

output "private_route_table_ids" {
  description = ""
  value       = [aws_route_table.private.id]
}