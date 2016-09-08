	var canvas;
	var gl;

	// Cube
	var pointsC = [];
	var colorsC = [];

	// Tetra
	var pointsT = [];
	var colorsT = [];

	// Octo
	var pointsO = [];
	var colorsO = [];

	// Axes: 0 = x; 1 = y; 3 = z
	var xAxisC = 0;
	var yAxisC = 1;
	var zAxisC = 2;

	var axisC = 0;

	var axisT = 0;
	var count = 0;

	var axisO = 1;
	var cubeSpeed = 3.0;
	var tetraSpeed = 3.0;
	var octoSpeed = 2.0;

	// Array of angles: 0 = x; 1 = y; 3 = z
	var theta = [ 0, 0, 0 ];
	var phi = [ 35, 45, 35 ];
	var phiT = [ 0, 0, 0 ];

	var thetaLoc;
	var isCube = true;
	var isTetra = true;
	var isOcto = true;

	window.onload = function init() {
		canvas = document.getElementById("gl-canvas");

		gl = WebGLUtils.setupWebGL(canvas);
		if (!gl) { alert("WebGL is not available"); }


		// --------------- Cube --------------------------

		colorCube();

		// --------------- Tetrahedron -------------------

		colorTetra();

		// --------------- Octahedron --------------------

		colorOcto();

		// viewport = rectangular area of display window
		gl.viewport(0, 0, canvas.width, canvas.height);
		// clear area of display for rendering at each frame
		gl.clearColor(0.1, 0.1, 0.1, 1.0);
		gl.enable(gl.DEPTH_TEST);


		// --------------- Load shaders and initialize attribute buffers

		render();

		// ------------------------------------------------------------------
		// Event listeners for buttons

		var isZ = false;
		var isY = false;
		var isX = false;

		//var isRotating = true;

		document.getElementById('xRot').onclick = function() {
			axisC = xAxisC;
			isX = !isX;
			document.getElementById('xRot').style.background='#EEE';
			if(!isX){
				document.getElementById('xRot').style.background='#bebfba';
			}
		};
		document.getElementById('yRot').onclick = function() {
			axisC = yAxisC;
			isY = !isY;
			document.getElementById('yRot').style.background='#bebfba';
			if(!isY){
				document.getElementById('yRot').style.background='#EEE';
			}
		};
		document.getElementById('zRot').onclick = function() {
			axisC = zAxisC;
			isZ = !isZ;
			document.getElementById('zRot').style.background='#bebfba';
			if(!isZ){
				document.getElementById('zRot').style.background='#EEE';
			}
		};
			document.getElementById('isC').onclick = function() {
			isCube = !isCube;
			document.getElementById('isC').style.background='#bebfba';
			if(!isCube){
				document.getElementById('isC').style.background='#EEE';
			}
		};
			document.getElementById('isT').onclick = function() {
			isTetra = !isTetra;
			document.getElementById('isT').style.background='#bebfba';
			if(!isTetra){
				document.getElementById('isT').style.background='#EEE';
			}
		};
			document.getElementById('isO').onclick = function() {
			isOcto = !isOcto;
			document.getElementById('isO').style.background='#bebfba';
			if(!isOcto){
				document.getElementById('isO').style.background='#EEE';
			}
		};
			document.getElementById('octoSpeedInc').onclick = function() {
			octoSpeed++;
			document.getElementById('octoSpeedInc').style.background='#bebfba';
			if(octoSpeed >= 12) {
				octoSpeed = 12;
				document.getElementById('octoSpeedInc').style.background='#EEE';
			}
		};
			document.getElementById('octoSpeedDec').onclick = function() {
			octoSpeed--;
			document.getElementById('octoSpeedDec').style.background='#bebfba';
			if(octoSpeed <= 0){
				octoSpeed = 0;
				document.getElementById('octoSpeedDec').style.background='#EEE';
			}
		};
			document.getElementById('tetraSpeedInc').onclick = function() {
			tetraSpeed++;
			document.getElementById('tetraSpeedInc').style.background='#bebfba';
			if(tetraSpeed >= 20) {
				tetraSpeed = 20;
				document.getElementById('tetraSpeedInc').style.background='#EEE';
			}
		};
			document.getElementById('tetraSpeedDec').onclick = function() {
			tetraSpeed--;
			document.getElementById('tetraSpeedDec').style.background='#bebfba';
			if(tetraSpeed <= 0){
				tetraSpeed = 0;
				document.getElementById('tetraSpeedDec').style.background='#EEE';
			}
		};
			document.getElementById('cubeSpeedInc').onclick = function() {
			cubeSpeed++;
			document.getElementById('cubeSpeedInc').style.background='#bebfba';
			if(cubeSpeed >= 20) {
				cubeSpeed = 20;
				document.getElementById('cubeSpeedInc').style.background='#EEE';
			}
		};
			document.getElementById('cubeSpeedDec').onclick = function() {
			cubeSpeed--;
			document.getElementById('cubeSpeedDec').style.background='#bebfba';
			if(cubeSpeed <= 0){
				cubeSpeed = 0;
				document.getElementById('cubeSpeedDec').style.background='#EEE';
			}
		};

	};

	// -------------------------------------------------------------------

	function render() {

		var programCube = initShaders(gl, "vertex-shader", "fragment-shader");
		gl.useProgram(programCube);

		// Buffer
		var ccBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, ccBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, transpose(colorsC), gl.STATIC_DRAW);

		// Cube colour; set attributes
		var cvColor = gl.getAttribLocation(programCube, "vColor");
		gl.vertexAttribPointer(cvColor, 4, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(cvColor);

		// Cube create points buffer
		var cvBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, cvBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, transpose(pointsC), gl.STATIC_DRAW);

		// Cube create position
		var cvPosition = gl.getAttribLocation(programCube, "vPosition");
		gl.vertexAttribPointer(cvPosition, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(cvPosition);

		thetaLoc = gl.getUniformLocation(programCube, "theta");

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		gl.uniform3fv(thetaLoc, theta);

		theta[axisC] += cubeSpeed;

		if(isCube) {
			// Render cube
			gl.drawArrays(gl.TRIANGLES, 0, pointsC.length);
		}

		requestAnimFrame(render);


		// --------------- Tetrahedron -------------------
		// Create a buffer object, initialise it, and associate it
		// with the associated attribute variable in our vertex shader
		if(isTetra) {
			phiT[axisT] += tetraSpeed;
			count += 8.0;

			if(count == 1080) {
				count = 0;
			}

			if(count <= 360) {

				axisT = 0;

				programTetra = initShaders(gl, "vertex-shaderTx", "fragment-shader");
				gl.useProgram(programTetra);

				tcBuffer = gl.createBuffer();
				gl.bindBuffer(gl.ARRAY_BUFFER, tcBuffer);
				gl.bufferData(gl.ARRAY_BUFFER, transpose(colorsT), gl.STATIC_DRAW);

				tvColor = gl.getAttribLocation(programTetra, "vColor");
				gl.vertexAttribPointer(tvColor, 3, gl.FLOAT, false, 0, 0);
				gl.enableVertexAttribArray(tvColor);

				tvBuffer = gl.createBuffer();
				gl.bindBuffer(gl.ARRAY_BUFFER, tvBuffer);
				gl.bufferData(gl.ARRAY_BUFFER, transpose(pointsT), gl.STATIC_DRAW);

				tvPosition = gl.getAttribLocation( programTetra, "vPositionTetrax");
				gl.vertexAttribPointer(tvPosition, 3, gl.FLOAT, false, 0, 0);
				gl.enableVertexAttribArray(tvPosition);

				thetaLoc = gl.getUniformLocation(programTetra, "phiT");

				gl.uniform3fv(thetaLoc, phiT);

				if(isTetra) {
					gl.drawArrays(gl.TRIANGLES, 0, pointsT.length);
				}
			}

			else if(count > 360 && count <= 720) {
				axisT = 1;

				programTetra = initShaders(gl, "vertex-shaderTy", "fragment-shader");
				gl.useProgram(programTetra);

				tcBuffer = gl.createBuffer();
				gl.bindBuffer(gl.ARRAY_BUFFER, tcBuffer);
				gl.bufferData(gl.ARRAY_BUFFER, transpose(colorsT), gl.STATIC_DRAW);

				tvColor = gl.getAttribLocation(programTetra, "vColor");
				gl.vertexAttribPointer( tvColor, 3, gl.FLOAT, false, 0, 0);
				gl.enableVertexAttribArray(tvColor);

				tvBuffer = gl.createBuffer();
				gl.bindBuffer(gl.ARRAY_BUFFER, tvBuffer);
				gl.bufferData(gl.ARRAY_BUFFER, transpose(pointsT), gl.STATIC_DRAW);

				tvPosition = gl.getAttribLocation( programTetra, "vPositionTetray");
				gl.vertexAttribPointer(tvPosition, 3, gl.FLOAT, false, 0, 0);
				gl.enableVertexAttribArray(tvPosition);

				thetaLoc = gl.getUniformLocation(programTetra, "phiT");
				gl.uniform3fv(thetaLoc, phiT);

				if(isTetra) {
					gl.drawArrays(gl.TRIANGLES, 0, pointsT.length);
				}
			}

			else {
				axisT = 2;

				var programTetra = initShaders(gl, "vertex-shaderTz", "fragment-shader");
				gl.useProgram(programTetra );

				var tcBuffer = gl.createBuffer();
				gl.bindBuffer(gl.ARRAY_BUFFER, tcBuffer);
				gl.bufferData(gl.ARRAY_BUFFER, transpose(colorsT), gl.STATIC_DRAW);

				var tvColor = gl.getAttribLocation(programTetra, "vColor");
				gl.vertexAttribPointer(tvColor, 3, gl.FLOAT, false, 0, 0);
				gl.enableVertexAttribArray(tvColor);

				var tvBuffer = gl.createBuffer();
				gl.bindBuffer(gl.ARRAY_BUFFER, tvBuffer);
				gl.bufferData(gl.ARRAY_BUFFER, transpose(pointsT), gl.STATIC_DRAW);

				var tvPosition = gl.getAttribLocation(programTetra, "vPositionTetraz");
				gl.vertexAttribPointer(tvPosition, 3, gl.FLOAT, false, 0, 0);
				gl.enableVertexAttribArray(tvPosition);

				thetaLoc = gl.getUniformLocation(programTetra, "phiT");

				gl.uniform3fv(thetaLoc, phiT);

				if(isTetra) {
					gl.drawArrays(gl.TRIANGLES, 0, pointsT.length);
					}
				}
		}

		// --------------- Octahedron --------------------
		// Create a buffer object, initialise it, and associate it
		// with the associated attribute variable in our vertex shader
		if(isOcto) {

			var programOcto = initShaders(gl, "vertex-shaderO", "fragment-shader");
			gl.useProgram(programOcto);

			var ocBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, ocBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, transpose(colorsO), gl.STATIC_DRAW);

			var ovColor = gl.getAttribLocation( programOcto, "vColor");
			gl.vertexAttribPointer(ovColor, 3, gl.FLOAT, false, 0, 0);
			gl.enableVertexAttribArray( ovColor );

			var ovBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, ovBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, transpose(pointsO), gl.STATIC_DRAW);

			var ovPosition = gl.getAttribLocation( programOcto, "vPositionOcto");
			gl.vertexAttribPointer(ovPosition, 3, gl.FLOAT, false, 0, 0 );
			gl.enableVertexAttribArray(ovPosition);

			phi[axisO] += octoSpeed;

			thetaLoc = gl.getUniformLocation(programOcto, "phi");
			gl.uniform3fv(thetaLoc, phi);
			if(isOcto) {
				gl.drawArrays(gl.TRIANGLES, 0, pointsO.length);
			}
		}
	}

	// DEFINE CUBE

	function colorCube() {
		square( 1, 0, 3, 2 );
		square( 2, 3, 7, 6 );
		square( 3, 0, 4, 7 );
		square( 6, 5, 1, 2 );
		square( 4, 5, 6, 7 );
		square( 5, 4, 0, 1 );
	}

	function square(a, b, c, d) {
		var verticesC = [
			vec3( -0.25, -0.25,  0.25 ),
			vec3( -0.25,  0.25,  0.25 ),
			vec3(  0.25,  0.25,  0.25 ),
			vec3(  0.25, -0.25,  0.25 ),
			vec3( -0.25, -0.25, -0.25 ),
			vec3( -0.25,  0.25, -0.25 ),
			vec3(  0.25,  0.25, -0.25 ),
			vec3(  0.25, -0.25, -0.25 )
		];

		var vertexColors = [
			[ 0.9, 0.9, 0.2, 1.0 ],  // orange
			[ 0.0, 1.0, 1.0, 1.0 ],  // cyan
			[ 1.0, 0.0, 0.0, 1.0 ],  // red
			[ 1.0, 1.0, 0.0, 1.0 ],  // yellow
			[ 0.0, 1.0, 0.0, 1.0 ],  // green
			[ 1.0, 0.0, 1.0, 1.0 ],  // magenta
			[ 0.0, 0.0, 1.0, 1.0 ],  // blue
			[ 1.0, 1.0, 1.0, 1.0 ]   // white

		];

		// Partion the square into two triangles in order for
		// WebGL to be able to render it.
		// Vertex color assigned by the index of the vertex

		var indices = [a, b, c, a, c, d];

		for (var i = 0; i < indices.length; ++i) {
			pointsC.push(verticesC[indices[i]]);
			colorsC.push(vertexColors[indices[i]]);

			//for solid colored faces use
			//colorsC.push(vertexColors[a]);
		}
	}

	// DEFINE TETRAHEDRON

	function colorTetra() {

		var verticesT = [
			vec3(  0.0000,  0.0000, -0.3500 ),
			vec3(  0.0000,  0.3500,  0.1500 ),
			vec3( -0.3500, -0.1500,  0.1500 ),
			vec3(  0.3500, -0.1500,  0.1500 )
		];

		tetra(verticesT[0], verticesT[1], verticesT[2], verticesT[3]);
	}

	function makeTetra(a, b, c, color) {
		// add colors and vertices for one triangle

		var baseColors = [
			vec3(1.0, 0.8, 0.2, 1.0), // left: yellow
			vec3(1.0, 0.2, 0.1, 1.0), // south: dark red
			vec3(1.0, 0.5, 0.3, 1.0), // light red
			vec3(1.0, 0.7, 0.7, 1.0)  // bottom
		];

		colorsT.push(baseColors[color]);
		pointsT.push(a);
		colorsT.push(baseColors[color]);
		pointsT.push(b);
		colorsT.push(baseColors[color]);
		pointsT.push(c);
	}

	function tetra(p, q, r, s) {
		// tetrahedron with each side using
		// a different color

		makeTetra(p, r, q, 0);
		makeTetra(p, r, s, 1);
		makeTetra(p, q, s, 2);
		makeTetra(q, r, s, 3);
	}

	// DEFINE OCTAHEDRON

	function colorOcto() {

		var verticesO = [
			vec3( 0.4000, 0.0000, 0.0000 ),
			vec3( 0.0000, 0.0000, 0.0000 ),
			vec3( 0.0000, 0.4000, 0.0000 ),
			vec3( 0.4000, 0.4000, 0.0000 ),
			vec3( 0.2000, 0.2000, 0.3000 ),
			vec3(  0.2000, 0.2000, -0.3000 )
		];

		octo(verticesO[0], verticesO[1], verticesO[2], verticesO[3], verticesO[4], verticesO[5]);
	}

	function makeOcto(a, b, c, color) {
		// add colors and vertices for one triangle

		var baseColors = [
			vec3(0.9, 0.9, 0.95, 1.0), 	// grey
			vec3(0.3, 0.4, 0.9, 1.0), 	// blue
			vec3(0.9, 0.9, 0.95, 1.0) 	// white
		];

		colorsO.push(baseColors[color]);
		pointsO.push(a);
		colorsO.push(baseColors[color]);
		pointsO.push(b);
		colorsO.push(baseColors[color]);
		pointsO.push(c);
	}

	function octo(a, b, c, d , e, f) {
		// tetrahedron with each side using
		// a different color

		makeOcto( a, d, e, 0 );
		makeOcto( a, b, e, 1 );
		makeOcto( b, c, e, 0 );
		makeOcto( c, d, e, 1 );
		makeOcto( a, d, f, 1 );
		makeOcto( a, b, f, 2 );
		makeOcto( b, c, f, 1 );
		makeOcto( c, d, f, 2 );
	}

	// -------------------------------------------------------------------

	function makeIdentity() {
	  return [
		1, 0, 0,
		0, 1, 0,
		0, 0, 1
	  ];
	}

	function mvPushMatrix(m) {
	  if (m) {
		mvMatrixStack.push(m.dup());
		mvMatrix = m.dup();
	  } else {
		mvMatrixStack.push(mvMatrix.dup());
	  }
	}

	function mvPopMatrix() {
	  if (!mvMatrixStack.length) {
		throw("Can't pop from an empty matrix stack.");
	  }
	  mvMatrix = mvMatrixStack.pop();
	  return mvMatrix;
	}

	function mvRotate(angle, v) {
	  var inRadians = angle * Math.PI / 180.0;
	  var m = Matrix.Rotation(inRadians, V([v[0], v[1], v[2]])).ensure4x4();
	  multMatrix(m);
	}