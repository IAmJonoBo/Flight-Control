output "vpc_id" {
  value = aws_vpc.main.id
}

output "ecs_cluster_id" {
  value = aws_ecs_cluster.flight_control.id
}