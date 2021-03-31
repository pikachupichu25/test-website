var layout_config = {
	name: 'cola', 
	animate: true,
	edgeLength: function(edge){return 50/edge.data('weight');}
};
var updateLayoutAfterAddNode = true;

// add a new node connected to a given node
// var addNode = function(cy, node, title, summary, link_title){
// 	var branch_size = node.connectedEdges().size();
// 	var new_node_id = node.id() + String(branch_size);
// 	var new_edge_id = node.id() + '-' + new_node_id;
// 	var x_pos = node.position('x');
// 	var y_pos = node.position('y');

// 	var new_xy_pos = findEmptyPostion(node, 200);
// 	cy.add([
// 		{group: 'nodes', data: {id: new_node_id, title: title, summary: summary}, position: {x:new_xy_pos[0], y:new_xy_pos[1]}},
// 		// need a better control of a position of a new node
// 		// by default {x: 0, y: 0}
// 		{group: 'edges', data: {id: new_edge_id, source: node.id(), target: new_node_id, title: link_title}}
// 	]);

// 	return cy.nodes().getElementById(new_node_id);
// }

var layoutRefresh = function(cy) {
	var layout = cy.layout(layout_config);
	layout.run();
	// setTimeout(function(){layout.stop();}, 500);
	// console.log('stop layout')
}

// graph with summary side pane

var toJson = function(obj){ return obj.json(); };
var graphP = fetch('keyword_elem.json').then(toJson);
// var styleP = fetch('keyword-graph-style.json').then(toJson)
Promise.all([graphP]).then(initCy);


//check https://blog.js.cytoscape.org/2020/05/11/layouts/ cola, fcose

var style = [
    {
        selector: "node",
        style: {
            "label": "data(id)",
            "text-wrap": "wrap",
            "text-max-width": "200px",
            "width": function(ele){return ele.data('weight')*50;},
            "height": function(ele){return ele.data('weight')*50;}

        }
    },
    {
        selector: "edge",
        style: {
            "curve-style": "bezier",
        }
    }
]

function initCy(then){
	var elems = then[0]
	var cy = window.cy = cytoscape({
	container: document.getElementById('cy'),
		style: style,
		elements: elems,
		layout: layout_config
	});

	document.getElementById("layoutButton").addEventListener("click", function(){
	let layoutType = document.getElementById("layout-type")
	let layout_type = layoutType.options[layoutType.selectedIndex].value
	if (layout_type==="cola"){
		layout_config = {
			name: layout_type, 
			animate: true,
			edgeLength: function(edge){return 50/edge.data('weight');}
		};
	}
	if (layout_type==="fcose"){
		layout_config = {
			name: layout_type, 
			animate: true,
			idealEdgeLength: function(edge){return 50/edge.data('weight');}
		};
	}
	
	var layout = cy.layout(layout_config);
	layout.run()
	})


	cy.on('tap', 'edge', function(evt){
		var edge = this;
		var output_text = "edge score: " + edge.data("weight")
		document.getElementById("elem_info").innerHTML = output_text;
	});

	cy.on('tap', 'node', function(evt){
		var node = this;
		var output_text = "node score: " + node.data("weight")
		document.getElementById("elem_info").innerHTML = output_text;
	});

	// psuedo-doubletap 
	// https://stackoverflow.com/questions/18610621/cytoscape-js-check-for-double-click-on-nodes
	var doubleClickDelayMs = 350;
	var previousTapStamp;
	cy.on('tap', function(evt){
		var currentTapStamp = evt.timeStamp;
		var msFromLastTap = currentTapStamp - previousTapStamp;
		if (msFromLastTap < doubleClickDelayMs) {
       		evt.target.trigger('doubleTap', evt);
    	}
    	previousTapStamp = currentTapStamp;
	});

	// doubleclick = show more node
	cy.on('doubleTap', 'node', function(evt){
		// generate nodes up to 
		// var node = this;
		// var branch_size = node.connectedEdges().size();
		// var new_node_num;
		// if (branch_size < 2) {
		// 	new_node_num = 3-branch_size;
		// } else {
		// 	new_node_num = 2;
		// }
		// var i;
		// var recenter = false
		// for (i=0; i<new_node_num; i++) {
		// 	var newNode = addNode(cy, node, 'dummy', 'dummy summary', 'link_name');
		// 	if (isNodeAtMargin(cy, newNode, 0)===true){
		// 		recenter=true;
		// 	}
		// }

		// if (updateLayoutAfterAddNode === true) {
		// 	layoutRefresh(cy);
		// }

		// if (recenter) {
		// 	cy.center(node);
		// 	console.log('recenter');
		// }

	});
};