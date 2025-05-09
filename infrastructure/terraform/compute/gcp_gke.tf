resource "google_container_cluster" "flight_control" {
  name     = "flight-control-gke"
  location = var.gcp_region
  initial_node_count = 1
}