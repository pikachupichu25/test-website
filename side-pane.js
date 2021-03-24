// var elems = {
// 		nodes: [
// 			{ data: { 
// 				id: 'a', 
// 				summary: 'This is Node A summary.',
// 				full_text: 'This is a long text. This is a long text. This is a long text. This is a long text. This is a long text.'
// 			} },
// 			{ data: { 
// 				id: 'b', 
// 				summary: 'This is Node B summary.',
// 				full_text: 'This is a long text. This is a long text. This is a long text. This is a long text. This is a long text.'
// 			} }
// 		],
// 		edges: [
// 			{ data: { id: 'ab', source: 'a', target: 'b' } }
// 		]
// 	}

// graph with summary side pane

var toJson = function(obj){ return obj.json(); };
var graphP = fetch('tippy-test-graph.json').then(toJson);
var styleP = fetch('graph-style.json').then(toJson)
Promise.all([graphP, styleP]).then(initCy);

function initCy(then){
	var elems = then[0]
	var cy = window.cy = cytoscape({
	container: document.getElementById('cy'),
	style: then[1],
	elements: elems,
	layout: {
		name: 'grid', //check https://blog.js.cytoscape.org/2020/05/11/layouts/
	}
	});

	cy.on('tap', 'node', function(evt){
		var node = this;
		var output_text = "<h2>"+node.data("title")+"</h2>"+ node.data("summary")
		document.getElementById("summary").innerHTML = output_text;
		
		// add condition: center if the node is at the margin
		// cy.center(node)
	});


}




