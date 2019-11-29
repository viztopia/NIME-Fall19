// Helper function to average points in 2D space
function getAvg(points) {
  let avg = 0;
  for(let point of points) {
    avg += point;
  }
  return avg / points.length;
}
