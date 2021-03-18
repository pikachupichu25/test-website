var cy = cytoscape({
  container: document.getElementById('cy'),
  elements: [
    // nodes
    { data: { id: 'a' } },
    { data: { id: 'b' } },
    { data: { id: 'c' } },
    { data: { id: 'd' } },
    { data: { id: 'e' } },
    { data: { id: 'f' } },
    // edges
    {
      data: {
        id: 'ab',
        source: 'a',
        target: 'b'
      }
    },
    {
      data: {
        id: 'cd',
        source: 'c',
        target: 'd'
      }
    },
    {
      data: {
        id: 'ef',
        source: 'e',
        target: 'f'
      }
    },
    {
      data: {
        id: 'ac',
        source: 'a',
        target: 'c'
      }
    },
    {
      data: {
        id: 'be',
        source: 'b',
        target: 'e'
      }
    }],
  style: [
    {
      selector: 'node',
      style: {
        shape: 'hexagon',
        'background-color': 'red',
        label: 'data(id)'
      }
    }]
});

cy.on('tap', 'node',function(event){
  // target holds a reference to the originator
  // of the event (core or element)
  var node = this;
  console.log('tapped' + node.id());

});

