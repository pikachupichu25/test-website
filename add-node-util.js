// calculate where to add a node

var origin_node;

// graph size in pixel
var graphSize = function(cy){
	var x = document.getElementById('cy').offsetWidth;
	var y = document.getElementById('cy').offsetHeight;
	return [x, y];
};

// check whether given rendered position x, y at the 'margin'
var isAtMargin = function(cy, x, y, margin_value) {
	graph_size = graphSize(cy);
	let not_margin_x = [graph_size[0]*margin_value, graph_size[0]*(1-margin_value)];
	let not_margin_y = [graph_size[1]*margin_value, graph_size[1]*(1-margin_value)];
	if (x > not_margin_x[0] && x < not_margin_x[1] && y > not_margin_y[0] && y < not_margin_y[1]){
		return false;
	} else {
		return true;
	}
}

var isNodeAtMargin = function(cy, node, margin_value){
	return isAtMargin(cy, node.renderedPosition('x'), node.renderedPosition('y'), margin_value);	
}

var vectorLength = function(x, y) {
	return Math.sqrt( Math.pow(x, 2) + Math.pow(y, 2) )
};

// Wait but the y coordinate is flipped!
var cosineFromVector = function(x1, y1, x2, y2){
	let vec1 = vectorLength(x1, y1*-1);
	let vec2 = vectorLength(x2, y2*-1);
	return (x1*x2 + y1*y2)/( vec1 + vec2);
}

var getRelativePosition = function(node, origin_node) {
	var x_rel = node.position('x') - origin_node.position('x');
	var y_rel = node.position('y') - origin_node.position('y');
	return [x_rel, y_rel];
}

// angle ccw from x-axis
var findAngle = function(x, y) {
	var len = vectorLength(x, y);
	var angle = Math.acos(x/len)/Math.PI*180;
	if (y*-1 < 0) {
		angle = 360 - angle;
	}
	return angle;
}

var getNewPosition = function(angle, distance, origin_node) {
	var x = Math.cos(angle/180*Math.PI) * distance;
	var y = Math.sin(angle/180*Math.PI) * distance * -1; // inverse

	return [x+origin_node.position('x'), y+origin_node.position('y')];
}



// main function return [x, y]
var findEmptyPostion = function(node, distance){
	origin_node = node
	var connected_nodes = node.connectedEdges().connectedNodes().not('#'+node.id());

	// get id to sort
	var node_id_angle = [];
	for (i=0; i < connected_nodes.size(); i++){
		var node_id = connected_nodes[i].data('id')
		var rel_x_y =getRelativePosition(connected_nodes[i], node)
		var angle = findAngle(rel_x_y[0], rel_x_y[1])
		node_id_angle[node_id] = angle
	}
	// console.log(node_id_angle)
	var node_by_pos = Object.keys(node_id_angle);
	node_by_pos.sort(function(a,b){return node_id_angle[a]-node_id_angle[b]});
	// console.log(node_by_pos)
	// find max angle
	var max_angle_node_id;
	var max_angle = 0;
	for (i=0; i < node_by_pos.length; i++){
		if (i+1 < node_by_pos.length){
			var angle = node_id_angle[node_by_pos[i+1]] - node_id_angle[node_by_pos[i]];
		} else {
			var angle = node_id_angle[node_by_pos[0]] - node_id_angle[node_by_pos[i]] + 360;
		}

		if (max_angle < angle){
			max_angle = angle;
			max_angle_node_id = node_by_pos[i];
		}
	}
	// console.log(max_angle_node_id)
	var new_node_angle = node_id_angle[max_angle_node_id] + max_angle/2;
	// console.log(new_node_angle)
	return getNewPosition(new_node_angle, distance, origin_node);
};