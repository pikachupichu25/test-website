var tippy_obj=[];
var shortText;
var shownTippy;
var addButton;
var layout_config = {name: 'cola', animate: true, nodeSpacing: function( node ){ return 90; }};
var local_layout_config = {name: 'cola'};

// hyperscript-like function
var h = function(tag, attrs, children){
	var el = document.createElement(tag);

	if(attrs != null && typeof attrs === typeof {}){
	  Object.keys(attrs).forEach(function(key){
	    var val = attrs[key];

	    el.setAttribute(key, val);
	  });
	} else if(typeof attrs === typeof []){
	  children = attrs;
	}

	if(children != null && typeof children === typeof []){
	  children.forEach(function(child){
	    el.appendChild(child);
	  });
	} else if(children != null && typeof children === typeof ''){
	  el.appendChild(document.createTextNode(children));
	}

	return el;
	};

function removeTippy(){
	if(shownTippy){
		shownTippy.hide();
		}
	}

var makeTippy = function(ele, html){
	removeTippy();
	var ref = ele.popperRef();

	// Since tippy constructor requires DOM element/elements, create a placeholder
	var dummyDomEle = document.createElement('div');

	shownTippy = tippy( dummyDomEle, {
		getReferenceClientRect: ref.getBoundingClientRect,
		content: html,
		allowHTML: true,
		trigger: 'manual', // mandatory
		// your own preferences:
		arrow: true,
		placement: 'bottom',
		hideOnClick: false,
		sticky: "reference",

		// if interactive:
		interactive: true,
		appendTo: document.body // or append dummyDomEle to document.body
	} );
	shownTippy.show();
	return shownTippy;
};

// add a new node connected to a given node
var addNode = function(cy, node, title, summary){
	var branch_size = node.connectedEdges().size();
	var new_node_id = node.id() + String(branch_size);
	var new_edge_id = node.id() + '-' + new_node_id;
	var x_pos = node.position('x');
	var y_pos = node.position('y');

	var new_xy_pos = findEmptyPostion(node, 200);
	cy.add([
		{group: 'nodes', data: {id: new_node_id, title: title, summary: summary}, position: {x:new_xy_pos[0], y:new_xy_pos[1]}},
		// need a better control of a position of a new node
		// by default {x: 0, y: 0}
		{group: 'edges', data: {id: new_edge_id, source: node.id(), target: new_node_id}}
	]);

	// var nodes = cy.$('#'+node.id()).union('#'+new_node_id)
	// do something with local node first
	// var local_nodes = node.connectedEdges().connectedNodes()
	// var layout = nodes.layout(local_layout_config)
	// layout.run();

	
	return cy.nodes().getElementById(new_node_id);
}

var layoutRefresh = function(cy) {
	var layout = cy.layout(layout_config);
	layout.run();
}

// graph with summary side pane

var toJson = function(obj){ return obj.json(); };
var graphP = fetch('tippy-test-graph.json').then(toJson);
var styleP = fetch('graph-style.json').then(toJson)
Promise.all([graphP, styleP]).then(initCy);


//check https://blog.js.cytoscape.org/2020/05/11/layouts/ cola, fcose


function initCy(then){
	var elems = then[0]
	var cy = window.cy = cytoscape({
	container: document.getElementById('cy'),
		style: then[1],
		elements: elems,
		layout: layout_config
	});

	document.getElementById("layoutButton").addEventListener("click", function(){
	let layoutType = document.getElementById("layout-type")
	layout_config = {
			name: layoutType.options[layoutType.selectedIndex].value, 
			animate: true,
			nodeSpacing: function( node ){ return 90; }
		}
	var layout = cy.layout(layout_config);
	layout.run()
	})


	cy.on('mouseover', 'node', function(evt){
		var node = this;
		
		var addButton = h('button', { id: 'add', }, '+');

		addButton.addEventListener('click', function(){
			// add event
			var summary = document.getElementById("summary");
			summary.innerHTML = '<input placeholder="dummy input box">'
			removeTippy();
			var new_node = addNode(cy, node, 'untitled', ''); // new node pending to change the data
			node.deselect();
			new_node.select();
			layoutRefresh(cy);
		});
		var html = h('div', { className: 'select-buttons' }, [addButton]);
		makeTippy(node, html);
	});

	cy.on('tap', 'node', function(evt){
		var node = this;
		var output_text = "<h2>"+node.data("title")+"</h2>"+ node.data("summary")
		document.getElementById("summary").innerHTML = output_text;
		
		// add condition: center if the node is at the margin
		// cy.center(node)
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

	cy.on('doubleTap', 'node', function(evt){
		// generate nodes up to 
		var node = this;
		var branch_size = node.connectedEdges().size();
		var new_node_num;
		if (branch_size < 2) {
			new_node_num = 3-branch_size;
		} else {
			new_node_num = 2;
		}
		var i;
		for (i=0; i<new_node_num; i++) {
			addNode(cy, node, 'dummy', 'dummy summary');
		}
		layoutRefresh(cy);


	});
};