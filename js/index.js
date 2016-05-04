var svg = d3.select("#plain")
            .on("mousemove", playTriangles)
            .on("mouseout", stopTriangles);

generateTriangles();

function generateTriangles(){
    for (var i = 0; i < 30; i++) {
        var dim = getRandomDimension();
        var x = getRandomCoordinateX(dim);
        var y = getRandomCoordinateY(dim);

        svg.append('path')
            .attr('id', 'tr_'+i)
            .attr('class', 'triangle')
            .attr('stroke', 'black')
            .attr('stroke-width', 3)
            .attr('fill', getRandomColor())
            .attr('dimension', dim)
            .attr('velocity', 2/dim)
            .attr('d', function(d) { 
                return equilateral_triangle_path(x,y,dim);
            });
    }
}

function playTriangles(event){
    event = event || window.event;

    if (event.pageX == null && event.clientX != null) {
        eventDoc = (event.target && event.target.ownerDocument) || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        event.pageX = event.clientX +
          (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
          (doc && doc.clientLeft || body && body.clientLeft || 0);
        event.pageY = event.clientY +
          (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
          (doc && doc.clientTop  || body && body.clientTop  || 0 );
    }

    d3.selectAll(".triangle").each(function(d,i) { 
        var _this = d3.select(this);
        var d_attribute = _this.attr('d').split(" ");
        var dim = _this.attr("dimension");
        var initial_x = parseInt(d_attribute[1]);
        var initial_y = parseInt(d_attribute[2]);
        var final_x = event.pageX - dim/2;
        var final_y = event.pageY - dim/2;
        var currentX = initial_x;
        var currentY = initial_y;
        if(_this.attr("transform")!=null){
            var transform = _this.attr("transform");
            var coords = transform.substring(transform.indexOf("(")+1, transform.indexOf(")")+1).split(",");
            currentX += parseInt(coords[0]);
            currentY += parseInt(coords[1]);
        }
        var distance = Math.sqrt(Math.pow(event.pageX-currentX,2)+Math.pow(event.pageY-currentY,2));
        var velocity = _this.attr('velocity');
        var time_exec = distance/velocity;
        var deltaX = final_x - initial_x;
        var deltaY = final_y - initial_y;
        var willMoveRandomPosition = true;


        if (final_x < 0){
            deltaX = -initial_x;
            willMoveRandomPosition = false;
        }else{
            var extraXspace = final_x - parseInt(svg.style("width"), 10) + dim*3/2;
            if (extraXspace > 0){
                deltaX = parseInt(svg.style("width"), 10) - initial_x - dim;
                willMoveRandomPosition = false;
            }
        }
        if (final_y < 0){
            deltaY = -initial_y;
            willMoveRandomPosition = false;
        }else {
            var extraYspace = final_y - parseInt(svg.style("height"), 10) + dim*3/2;
            if (extraYspace > 0){
                deltaY = parseInt(svg.style("height"), 10) - initial_y - dim;
                willMoveRandomPosition = false;
            }
        }

        var translate = "translate("+ deltaX +","+ deltaY +")";
        if(willMoveRandomPosition){
            _this.transition().duration(time_exec).attr("transform", translate).each("end", moveRandomPosition);
        }else{
            _this.transition().duration(time_exec).attr("transform", translate);
        }
    });
}

function stopTriangles(event){
    d3.selectAll(".triangle").transition();
}

function moveRandomPosition(){
    var _this = d3.select(this);
    var dim = parseInt(_this.attr('dimension'));
    var x = getRandomCoordinateX(dim);
    var y = getRandomCoordinateY(dim);
    _this.attr("transform", null)
            .attr('d', function(d) { 
                return equilateral_triangle_path(x,y,dim);
            });
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getRandomCoordinateX(dimension){
    var width = parseInt(svg.style("width"), 10) - dimension;
    var x = Math.ceil(Math.random() * width);
    return x;
}

function getRandomCoordinateY(dimension){
    var height = parseInt(svg.style("height"), 10) - dimension;
    var y = Math.ceil(Math.random() * height);
    return y;
}

function getRandomDimension(minDimension, maxDimension) {
    if (typeof(minDimension)==='undefined') minDimension = 20;
    if (typeof(maxDimension)==='undefined') maxDimension = 60;
    var dim = Math.ceil(Math.random() * (maxDimension-minDimension) + minDimension);
    if (dim%2 != 0) dim++;
    return dim;
}

function equilateral_triangle_path(x,y,dim) {
    return 'M ' + x +' '+ y + ' L ' + (x+dim) +' '+ y +' L '+ (x+dim/2) +' '+ (y+dim) +' z';
}