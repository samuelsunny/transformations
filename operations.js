function get_value(operation)
{
	console.log(document.getElementById("scale_factor_x").value,document.getElementById("scale_factor_y").value,document.getElementById("scale_factor_z").value);
	console.log("operation:",operation);

	if(operation == 1)
	{
		translate();
	}
	else if(operation == 2)
	{
		rotate();
	}
	else
	{
		scale();
	}
	
}
var MDN = MDN || {};
MDN.matrixArrayToCssMatrix = function (array) {
return "matrix3d(" + array.join(',') + ")";
}

MDN.multiplyMatrixAndPoint = function (matrix, point) {

//Give a simple variable name to each part of the matrix, a column and row number
var c0r0 = matrix[ 0], c1r0 = matrix[ 1], c2r0 = matrix[ 2], c3r0 = matrix[ 3];
var c0r1 = matrix[ 4], c1r1 = matrix[ 5], c2r1 = matrix[ 6], c3r1 = matrix[ 7];
var c0r2 = matrix[ 8], c1r2 = matrix[ 9], c2r2 = matrix[10], c3r2 = matrix[11];
var c0r3 = matrix[12], c1r3 = matrix[13], c2r3 = matrix[14], c3r3 = matrix[15];

//Now set some simple names for the point
var x = point[0];
var y = point[1];
var z = point[2];
var w = point[3];

//Multiply the point against each part of the 1st column, then add together
var resultX = (x * c0r0) + (y * c0r1) + (z * c0r2) + (w * c0r3);

//Multiply the point against each part of the 2nd column, then add together
var resultY = (x * c1r0) + (y * c1r1) + (z * c1r2) + (w * c1r3);

//Multiply the point against each part of the 3rd column, then add together
var resultZ = (x * c2r0) + (y * c2r1) + (z * c2r2) + (w * c2r3);

//Multiply the point against each part of the 4th column, then add together
var resultW = (x * c3r0) + (y * c3r1) + (z * c3r2) + (w * c3r3);

return [resultX, resultY, resultZ, resultW];
}

MDN.multiplyMatrices = function (matrixA, matrixB) {

// A faster implementation of this function would not create
// any new arrays. This creates arrays for code clarity.

// Slice the second matrix up into rows
var row0 = [matrixB[0], matrixB[1], matrixB[2], matrixB[3]];
var row1 = [matrixB[4], matrixB[5], matrixB[6], matrixB[7]];
var row2 = [matrixB[8], matrixB[9], matrixB[10], matrixB[11]];
var row3 = [matrixB[12], matrixB[13], matrixB[14], matrixB[15]];

// Multiply each row by the matrix
var result0 = MDN.multiplyMatrixAndPoint( matrixA, row0 );
var result1 = MDN.multiplyMatrixAndPoint( matrixA, row1 );
var result2 = MDN.multiplyMatrixAndPoint( matrixA, row2 );
var result3 = MDN.multiplyMatrixAndPoint( matrixA, row3 );

// Turn the results back into a single matrix
return [
	result0[0], result0[1], result0[2], result0[3],
	result1[0], result1[1], result1[2], result1[3],
	result2[0], result2[1], result2[2], result2[3],
	result3[0], result3[1], result3[2], result3[3],
];
}

MDN.multiplyArrayOfMatrices = function (matrices) {

var inputMatrix = matrices[0];

for(var i=1; i < matrices.length; i++) {
	inputMatrix = MDN.multiplyMatrices(inputMatrix, matrices[i]);
}

return inputMatrix;
}

function translate()
{
	/*

	A translation matrix is based off the identity matrix. It moves the object in one of 3 directions, x, y, or z. The easiest way to think of a translation is like picking up a coffee cup. The coffee cup must be kept upright and oriented the same way so that no coffee is spilled. It can move up in the air off the table and around the air in space.

	Now the coffee can't actually be drank with only a translation matrix because the cup cannot be tilted. In another lesson, a new matrix will be discussed that will be able to handle that task.

	*/

	var x = parseInt(document.getElementById("scale_factor_x").value);
	var y = parseInt(document.getElementById("scale_factor_y").value);
	var z = parseFloat(document.getElementById("scale_factor_z").value);
	console.log("z:",z);
	
	document.getElementById("scaling_x").innerHTML = x + "&nbsp";
	document.getElementById("scaling_y").innerHTML = y + "&nbsp";
	document.getElementById("scaling_z").innerHTML = z + "&nbsp";

	var translationMatrix = [
		1,    0,    0,   0,
		0,    1,    0,   0,
		0,    0,    1,   0,
		x,    y,    z,   1
	];

	// Grab the DOM element
	var moveMe = document.getElementById('move-me');

	// Returns a result like: "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 100, 200, 0, 1);"
	var matrix3dRule = MDN.matrixArrayToCssMatrix( translationMatrix );

	// Set the transform
	moveMe.style.transform = matrix3dRule;
}

function scale()
{
	/*

	A scale matrix makes something larger or smaller in one of 3 dimension: width, height, and depth. In typical (cartesian) coordinates this would be stretching and shrinking in x, y, and z.

	*/

	var w = parseFloat(document.getElementById("scale_x").value); // width  (x)
	var h = parseFloat(document.getElementById("scale_y").value); // height (y)
	var d = parseFloat(document.getElementById("scale_z").value);;   // depth  (z)
	console.log("Scaling:",w,h,d);
	console.log("Sale:",document.getElementById("show_scale_x").innerHTML);
	document.getElementById("show_scale_x").innerHTML = w + "&nbsp";
	document.getElementById("show_scale_y").innerHTML = h + "&nbsp";
	document.getElementById("show_scale_z").innerHTML = d + "&nbsp";
	
	var scaleMatrix = [
		w,    0,    0,   0,
		0,    h,    0,   0,
		0,    0,    d,   0,
		0,    0,    0,   1
	];

	var scaleMe = document.getElementById('scale-me');

	var matrix3dRule = MDN.matrixArrayToCssMatrix( scaleMatrix );

	scaleMe.style.transform = matrix3dRule;
}

function rotate()
{
	/*

	Rotation matrices start looking a little bit more complicated than scaling and transform matrices. They use trigonometric functions to perform the rotation. While this section won't break the steps down into exhaustive detail, take this example for illustration.

	// Manually rotating a point about the origin without matrices
	var point = [10,2];

	// Calculate the distance from the origin
	var distance = Math.sqrt(point[0] * point[0] + point[1] * point[1]);

	// 60 degrees
	var rotationInRadians = Math.PI / 3; 

	var transformedPoint = [
	  Math.cos( rotationInRadians ) * distance,
	  Math.sin( rotationInRadians ) * distance
	];


	It is possible to encode these type of steps into a matrix, and do it each of the x, y, and z dimensions. Below is the representation of a rotation about the X axis

	*/

	var sin = Math.sin;
	var cos = Math.cos;

	// NOTE: There is no perspective in these transformations, so a rotation
	//       at this point will only appear to only shrink the div
	console.log("Rotation angle:",parseFloat(document.getElementById("angle").value));

	var a = Math.PI * parseFloat(document.getElementById("angle").value); //Rotation amount
	
	document.getElementById("cosine").innerHTML = cos(a) + "&nbsp";
	document.getElementById("cosine_two").innerHTML = cos(a) + "&nbsp";
	document.getElementById("sine").innerHTML = sin(a) + "&nbsp";
	document.getElementById("neg_sine").innerHTML = -sin(a) + "&nbsp";


	// Rotate around Z axis
	var rotateZMatrix = [
	  cos(a), sin(a),    0,    0,
	  -sin(a),  cos(a),    0,    0,
		   0,       0,    1,    0,
		   0,       0,    0,    1
	];

	var moveMe = document.getElementById('rotate-me');

	var matrix3dRule = MDN.matrixArrayToCssMatrix( rotateZMatrix );

	moveMe.style.transform = matrix3dRule;
}
