
// ---------------------- HELPER FUNCTIONS ----------------------

function degreesToRadians(degrees) {
	return degrees * Math.PI / 180;
}

if(typeof Float32Array !== "undefined") {
	var glMatrixArray = Float32Array;
}
else {
	if(typeof WebGLFloatArray !== "undefined") {
		glMatrixArray = WebGLFloatArray;
	}
	else{
		glMatrixArray = Array;
	}
}

window.getAnimationFrame = (function() {
	if(window.requestAnimationFrame) {
		return window.requestAnimationFrame;
	}
	else if(window.webkitRequestAnimationFrame) {
		return window.webkitRequestAnimationFrame;
	}
	else if(window.mozRequestAnimationFrame) {
		return window.mozRequestAnimationFrame;
	}
	else{
		return function(callback) {
			window.setTimeout(callback, (1000/60));
		}
	}
})();


var vec3 = {};

vec3.create = function() {
	var newMtrx = new glMatrixArray(3);
	return newMtrx;
};

vec3.set = function(a, b) {
	b[0] = a[0];
	b[1] = a[1];
	b[2] = a[2];
	return b
};

// -----------------------------------------------------------------------

// Mat3 functions
// create object to handle matrix operations

var mat3 = {};

mat3.create = function() {
	var newMtrx = new glMatrixArray(9);
	return newMtrx;
};

mat3.transpose = function(first, second) {
	if(!second || first == second) {
		var a = first[1];
		var b = first[2];
		var c = first[5];

		first[1] = first[3];
		first[2] = first[6];
		first[3] = a;
		first[5] = first[7];
		first[6] = b;
		first[7] = c;
		return first
	}
	second[0] = first[0];
	second[1] = first[3];
	second[2] = first[6];
	second[3] = first[1];
	second[4] = first[4];
	second[5] = first[7];
	second[6] = first[2];
	second[7] = first[5];
	second[8] = first[8];
	return second
};

// -----------------------------------------------------------------------

// Mat4 functions
// create object to handle matrix operations

var mat4 = {};

mat4.create = function() {
	var newMtrx = new glMatrixArray(16);
	return newMtrx;
};

mat3.setInput = function(newMtrx, a, b, c, d, e, f, g, h, i) {
	newMtrx[0] = a;
	newMtrx[1] = b;
	newMtrx[2] = c;

	newMtrx[3] = d;
	newMtrx[4] = e;
	newMtrx[5] = f;

	newMtrx[6] = g;
	newMtrx[7] = g;
	newMtrx[8] = i;

	return newMtrx;
};

mat3.set = function(oldMtrx, newMtrx) {
	newMtrx[0] = oldMtrx[0];
	newMtrx[1] = oldMtrx[1];
	newMtrx[2] = oldMtrx[2];
	newMtrx[3] = oldMtrx[3];
	newMtrx[4] = oldMtrx[4];
	newMtrx[5] = oldMtrx[5];
	newMtrx[6] = oldMtrx[6];
	newMtrx[7] = oldMtrx[7];
	newMtrx[8] = oldMtrx[8];

	return newMtrx;
};

// Set - copies matrices

mat4.set = function(oldMtrx, newMtrx) {
	newMtrx[0] = oldMtrx[0];
	newMtrx[1] = oldMtrx[1];
	newMtrx[2] = oldMtrx[2];
	newMtrx[3] = oldMtrx[3];

	newMtrx[4] = oldMtrx[4];
	newMtrx[5] = oldMtrx[5];
	newMtrx[6] = oldMtrx[6];
	newMtrx[7] = oldMtrx[7];

	newMtrx[8] = oldMtrx[8];
	newMtrx[9] = oldMtrx[9];
	newMtrx[10] = oldMtrx[10];
	newMtrx[11] = oldMtrx[11];

	newMtrx[12] = oldMtrx[12];
	newMtrx[13] = oldMtrx[13];
	newMtrx[14] = oldMtrx[14];
	newMtrx[15] = oldMtrx[15];

	return newMtrx;
};

// IdentityMatrix

mat4.identity = function(mtrx) {
	mtrx[0] = 1;
	mtrx[1] = 0;
	mtrx[2] = 0;
	mtrx[3] = 0;
	mtrx[4] = 0;
	mtrx[5] = 1;
	mtrx[6] = 0;
	mtrx[7] = 0;
	mtrx[8] = 0;
	mtrx[9] = 0;
	mtrx[10] = 1;
	mtrx[11] = 0;
	mtrx[12] = 0;
	mtrx[13] = 0;
	mtrx[14] = 0;
	mtrx[15] = 1;

	return mtrx;
};

// Transpose

mat4.transpose = function(mtrx) {

	var newMatrix = mat4.create();

	newMatrix[0] = mtrx[0];
	newMatrix[1] = mtrx[4];
	newMatrix[2] = mtrx[8];
	newMatrix[3] = mtrx[12];
	newMatrix[4] = mtrx[1];
	newMatrix[5] = mtrx[5];
	newMatrix[6] = mtrx[9];
	newMatrix[7] = mtrx[13];
	newMatrix[8] = mtrx[2];
	newMatrix[9] = mtrx[6];
	newMatrix[10] = mtrx[10];
	newMatrix[11] = mtrx[14];
	newMatrix[12] = mtrx[3];
	newMatrix[13] = mtrx[7];
	newMatrix[14] = mtrx[11];
	newMatrix[15] = mtrx[15];

	return newMatrix;
};


mat4.toInverseMat3 = function(a, b) {

	var c = a[0];
	var d = a[1];
	var e = a[2];
	var g = a[4];
	var f = a[5];
	var h = a[6];
	var i = a[8];
	var j = a[9];
	var k = a[10];
	var l = k * f - h * j;
	var o =-k * g + h * i;
	var m = j * g - f * i;
	var n = c * l + d * o + e * m;

	if(!n) {
		return null;
	}

	n = 1/n;
	b||(b = mat3.create());

	b[0] = l * n;
	b[1] = (-k * d + e * j) * n;
	b[2] = (h * d - e * f) * n;
	b[3] = o * n;
	b[4]=(k * c - e * i) * n;
	b[5] = (-h * c + e * g) * n;
	b[6] = m * n;
	b[7] = (-j * c + d * i) * n;
	b[8] = (f * c - d * g) * n;

	return b
};

mat4.multiply = function(a, b, c) {
	c||(c = a);

	var d = a[0];
	var e = a[1];
	var g = a[2];
	var f = a[3];
	var h = a[4];
	var i = a[5];
	var j = a[6];
	var k = a[7];
	var l = a[8];
	var o = a[9];
	var m = a[10];
	var n = a[11];
	var p = a[12];
	var r = a[13];
	var s = a[14];

	a=a[15];

	var A = b[0];
	var B = b[1];
	var t = b[2];
	var u = b[3];
	var v = b[4];
	var w = b[5];
	var x = b[6];
	var y = b[7];
	var z = b[8];
	var C = b[9];
	var D = b[10];
	var E = b[11];
	var q = b[12];
	var F = b[13];
	var G = b[14];

	b=b[15];

	c[0] = A * d + B * h + t * l + u * p;
	c[1] = A * e + B * i + t * o + u * r;
	c[2] = A * g + B * j + t * m + u * s;
	c[3] = A * f + B * k + t * n + u * a;
	c[4] = v * d + w * h + x * l + y * p;
	c[5] = v * e + w * i + x * o + y * r;
	c[6] = v * g + w * j + x * m + y * s;
	c[7] = v * f + w * k + x * n + y * a;
	c[8] = z * d + C * h + D * l + E * p;
	c[9] = z * e + C * i + D * o + E * r;
	c[10] = z * g + C * j + D * m + E * s;
	c[11] = z * f + C * k + D * n + E * a;
	c[12] = q * d + F * h + G * l + b * p;
	c[13] = q * e + F * i + G * o + b * r;
	c[14] = q * g + F * j + G * m + b * s;
	c[15] = q * f + F * k + G * n + b * a;

	return c
};


// ---------------------- TRANSFORMATION MATRICES ----------------------
// Translate

mat4.translate = function(mtrx, translationValue) {

	var a = translationValue[0];
	var b = translationValue[1];
	var c = translationValue[2];

	mtrx[12] = (mtrx[0] * a) + (mtrx[4] * b) + (mtrx[8]  * c) + mtrx[12];
	mtrx[13] = (mtrx[1] * a) + (mtrx[5] * b) + (mtrx[9]  * c) + mtrx[13];
	mtrx[14] = (mtrx[2] * a) + (mtrx[6] * b) + (mtrx[10] * c) + mtrx[14];
	mtrx[15] = (mtrx[3] * a) + (mtrx[7] * b) + (mtrx[11] * c) + mtrx[15];

	return mtrx;
};

// Scaling matrix

mat4.scale = function(mtrx, vector) {
	var alphaX = vector[0];
	var alphaY = vector[1];
	var alphaZ = vector[2];

	mtrx[0] = mtrx[0] * alphaX;
	mtrx[1] = mtrx[1] * alphaX;
	mtrx[2] = mtrx[2] * alphaX;
	mtrx[3] = mtrx[3] * alphaX;

	mtrx[4] = mtrx[4] * alphaY;
	mtrx[5] = mtrx[5] * alphaY;
	mtrx[6] = mtrx[6] * alphaY;
	mtrx[7] = mtrx[7] * alphaY;

	mtrx[8] = mtrx[8] * alphaZ;
	mtrx[9] = mtrx[9] * alphaZ;
	mtrx[10] = mtrx[10] * alphaZ;
	mtrx[11] = mtrx[11] * alphaZ;

	return mtrx;
};

// ---------------------- ROTATION MARICES ----------------------
// RotateX

mat4.rotateX = function(mtrx, theta, otherMtrx) {

	var sine = Math.sin(theta);
	var cosine = Math.cos(theta);

	var a = mtrx[4];
	var b = mtrx[5];
	var c = mtrx[6];
	var d = mtrx[7];
	var e = mtrx[8];
	var f = mtrx[9];
	var g = mtrx[10];
	var h = mtrx[11];

	if(mtrx !== otherMtrx && otherMtrx) {
		otherMtrx[0] = mtrx[0];
		otherMtrx[1] = mtrx[1];
		otherMtrx[2] = mtrx[2];
		otherMtrx[3] = mtrx[3];
		otherMtrx[12] = mtrx[12];
		otherMtrx[13] = mtrx[13];
		otherMtrx[14] = mtrx[14];
		otherMtrx[15] = mtrx[15];
	}

	otherMtrx[4] = (a * cosine) + (e * sine);
	otherMtrx[5] = (b * cosine) + (f * sine);
	otherMtrx[6] = (c * cosine) + (g * sine);
	otherMtrx[7] = (d * cosine) + (h * sine);

	otherMtrx[8] = (a * (-1 * sine)) + (e * cosine);
	otherMtrx[9] = (b * (-1 * sine)) + (f * cosine);
	otherMtrx[10] = (c * (-1 * sine)) + (g * cosine);
	otherMtrx[11] = (d * (-1 * sine)) + (h * cosine);

	return otherMtrx;
};

// RotateY

mat4.rotateY = function(mtrx, theta, otherMtrx) {

	var sine = Math.sin(theta);
	var cosine = Math.cos(theta);

	var a = mtrx[0];
	var b = mtrx[1];
	var c = mtrx[2];
	var d = mtrx[3];
	var e = mtrx[8];
	var f = mtrx[9];
	var g = mtrx[10];
	var h = mtrx[11];

	if(mtrx !== otherMtrx && otherMtrx){
		otherMtrx[4] = mtrx[4];
		otherMtrx[5] = mtrx[5];
		otherMtrx[6] = mtrx[6];
		otherMtrx[7] = mtrx[7];
		otherMtrx[12] = mtrx[12];
		otherMtrx[13] = mtrx[13];
		otherMtrx[14] = mtrx[14];
		otherMtrx[15] = mtrx[15];
	}

	otherMtrx[0] = (a * cosine) + (e * (-1 * sine));
	otherMtrx[1] = (b * cosine) + (f * (-1 * sine));
	otherMtrx[2] = (c * cosine) + (g * (-1 * sine));
	otherMtrx[3] = (d * cosine) + (h * (-1 * sine));

	otherMtrx[8] = (a * sine) + (e * cosine);
	otherMtrx[9] = (b * sine) + (f * cosine);
	otherMtrx[10] = (c * sine) + (g * cosine);
	otherMtrx[11] = (d * sine) + (h * cosine);

	return otherMtrx;
};

// RotateZ

mat4.rotateZ = function(mtrx, theta, otherMtrx) {

	var sine = Math.sin(theta);
	var cosine = Math.cos(theta);

	var a = mtrx[0];
	var b = mtrx[1];
	var c = mtrx[2];
	var d = mtrx[3];
	var e = mtrx[4];
	var f = mtrx[5];
	var g = mtrx[6];
	var h = mtrx[7];

	if(mtrx !== otherMtrx && otherMtrx) {
		otherMtrx[8] = mtrx[8];
		otherMtrx[9] = mtrx[9];
		otherMtrx[10] = mtrx[10];
		otherMtrx[11] = mtrx[11];
		otherMtrx[12] = mtrx[12];
		otherMtrx[13] = mtrx[13];
		otherMtrx[14] = mtrx[14];
		otherMtrx[15] = mtrx[15];
	}

	otherMtrx[0] = (a * cosine) + (e * sine);
	otherMtrx[1] = (b * cosine) + (f * sine);
	otherMtrx[2] = (c * cosine) + (g * sine);
	otherMtrx[3] = (d * cosine) + (h * sine);

	otherMtrx[4] = (a * (-1 * sine)) + (e * cosine);
	otherMtrx[5] = (b * (-1 * sine)) + (f * cosine);
	otherMtrx[6] = (c * (-1 * sine)) + (g * cosine);
	otherMtrx[7] = (d * (-1 * sine)) + (h * cosine);

	return otherMtrx;
};

// RotateMatrix

mat4.rotate = function(mtrx, angle, axisToRotate) {

	var x_axis = axisToRotate[0]; var y_axis = axisToRotate[1]; var z_axis = axisToRotate[2];

	if(x_axis !== 0) {
		return mat4.rotateX(mtrx, angle, mtrx);
	}

	if(y_axis !== 0) {
		return mat4.rotateY(mtrx, angle, mtrx);
	}

	if(z_axis !== 0) {
		return mat4.rotateZ(mtrx, angle, mtrx);
	}
};

// ---------------------- SHEARING MARICES ----------------------
// ShearX

mat4.shearX = function(mtrx, theta) {

	var cotTheta = 1/Math.tan(theta);

	// Calculated by multiplying:
	// 1 cot 0 0
	// 0  1  0 0
	// 0  0  1 0
	// 0  0  0 1
	// with model-view mtrx

	mtrx[4] = mtrx[0] + mtrx[4]*cotTheta;
	mtrx[5] = mtrx[1] + mtrx[5]*cotTheta;
	mtrx[6] = mtrx[2] + mtrx[6]*cotTheta;
	mtrx[7] = mtrx[3] + mtrx[7]*cotTheta;

	return mtrx;
};

// ShearY

mat4.shearY = function(mtrx, theta) {

	var cotTheta = 1/Math.tan(theta);

	// Calculated by multiplying:
	// 1    0 0 0
	// cot  1 0 0
	// 0    0 1 0
	// 0    0 0 1
	// with model-view mtrx

	mtrx[8] = mtrx[8] + mtrx[4] * cotTheta;
	mtrx[9] = mtrx[9] + mtrx[5] * cotTheta;
	mtrx[10] = mtrx[10] + mtrx[6] * cotTheta;
	mtrx[11] = mtrx[11] + mtrx[7] * cotTheta;

	return mtrx;
};

// ShearZ

mat4.shearZ = function(mtrx, theta) {

	var cotTheta = 1/Math.tan(theta);

	// Shear on z is equal to shear in x and y

	mtrx[4] = mtrx[4] + mtrx[0] * cotTheta;
	mtrx[5] = mtrx[5] + mtrx[1] * cotTheta;
	mtrx[6] = mtrx[6] + mtrx[2] * cotTheta;
	mtrx[7] = mtrx[7] + mtrx[3] * cotTheta;
	mtrx[8] = mtrx[8] + mtrx[4] * cotTheta;
	mtrx[9] = mtrx[9] + mtrx[5] * cotTheta;
	mtrx[10] = mtrx[10] + mtrx[6] * cotTheta;
	mtrx[11] = mtrx[11] + mtrx[7] * cotTheta;

	return mtrx;
};

// Shearing matrix

mat4.shear = function(mtrx, theta, axisVector) {

	var axisX = axisVector[0];
	var axisY = axisVector[1];
	var axisZ = axisVector[2];

	var mtrxX = mat4.shearX(mtrx, theta);
	var mtrxY = mat4.shearY(mtrx, theta);
	var mtrxZ = mat4.shearZ(mtrx, theta);

	if(axisX !== 0) {
		return mtrxX
	}

	else if(axisY !== 0) {
		return mtrxY
	}

	else if(axisZ !== 0) {
		return mtrxZ
	}

	else if(axisX !== 0 && axisY !== 0 && axisZ === 0) {
		return mat4.matrixMultiply(mtrxX, mtrxY);
	}

	else if(axisX !== 0 && axisZ !== 0 && axisY === 0) {
		return mat4.matrixMultiply(mtrxX, mtrxZ);
	}

	else if(axisY !== 0 && axisZ !== 0 && axisX === 0) {
		return mat4.matrixMultiply(mtrxY, mtrxZ);
	}

	else if(axisY !== 0 && axisZ !== 0 && axisX !== 0) {
		var res = mat4.matrixMultiply(mtrxX, mtrxY);
		return mat4.matrixMultiply(res, mtrxZ);
	}
};


// ---------------------- VIEWING MARICES ----------------------
// Orthographic projection matrix

mat4.ortho = function(left, right, bottom, top, near, far, pMtrx) {

	if(!pMatrix){
		pMatrix = mat4.create();
	}

	var a = right - left;
	var b = top - bottom;
	var c = far - near;

	pMtrx[0] = 2/a;
	pMtrx[1] = 0;
	pMtrx[2] = 0;
	pMtrx[3] = 0;
	pMtrx[4] = 0;
	pMtrx[5] = 2/b;
	pMtrx[6] = 0;
	pMtrx[7] = 0;
	pMtrx[8] = 0;
	pMtrx[9] = 0;
	pMtrx[10] = -2/c;
	pMtrx[11] = 0;
	pMtrx[12] = -1 * (left + right)/a;
	pMtrx[13] = -1 * (top + bottom)/b;
	pMtrx[14] = -1 * (far + near )/c;
	pMtrx[15] = 1;

	return pMtrx;
};

// Oblique projection matrix

mat4.oblique = function(left, right, bottom, top, near, far, pMtrx, theta, phi) {

	if(!pMtrx){
		pMtrx = mat4.create();
	}

	var t = degreesToRadians(theta);
	var p = degreesToRadians(phi);

	var cotT = -1/Math.tan(t);
	var cotP = -1/Math.tan(p);

	var a = 2/(right - left);
	var b = -1 * (right + left)/(right - left);
	var c = 2/(top - bottom);
	var d = -1 * (top + bottom)/(top - bottom);
	var e = 12/(far - near);
	var f = -1 * (far + near)/(far - near);

	pMtrx[0] = a;
	pMtrx[1] = 0;
	pMtrx[2] = 0;
	pMtrx[3] = 0;
	pMtrx[4] = 0;
	pMtrx[5] = c;
	pMtrx[6] = 0;
	pMtrx[7] = 0;
	pMtrx[8] = -e * cotT;
	pMtrx[9] = -e * cotP;
	pMtrx[10] = e;
	pMtrx[11] = 0;
	pMtrx[12] = b - f * cotT;
	pMtrx[13] = d = cotP;
	pMtrx[14] = 0;
	pMtrx[15] = 1;

	return pMtrx;
};

mat4.perspective = function(top, right, near, far, pMtrx) {

	if(!pMtrx){
		pMtrx = mat4.create();
	}

	top = near*Math.tan((top * Math.PI)/360);
	right = top * right;

	var left = -1 * right;
	var bottom = -1 * top;
	var a = right - left;
	var b = top - bottom;
	var c = far - near;

	pMtrx[0] = (2 * near)/a;
	pMtrx[1] = 0;
	pMtrx[2] = 0;
	pMtrx[3] = 0;

	pMtrx[4] = 0;
	pMtrx[5] = (near * 2)/b;
	pMtrx[6] = 0;
	pMtrx[7] = 0;

	pMtrx[8] = (right + left)/a;
	pMtrx[9] = (top + bottom)/b;
	pMtrx[10] = ((-1 * (far + near))/c);
	pMtrx[11] = -1;

	pMtrx[12] = 0;
	pMtrx[13] = 0;
	pMtrx[14] = ((-1 * (far * near * 2)) / c);
	pMtrx[15] = 0;

	return pMtrx;
};

// LookAt projection matrix

mat4.lookAt = function(eye, at, up, pMtrx) {

	if(!pMtrx){
		pMtrx = mat4.create();
	}

	var e = eye[0],g = eye[1];
	eye = eye[2];
	var f = up[0],h = up[1],i = up[2];
	up = at[1];
	var j = at[2];

	if(e == at[0 ]&& g == up && eye == j) {
		return mat4.identity(pMtrx);
	}

	var k, l, o, m;

	up = e - at[0];
	j = g - at[1];
	at = eye - at[2];
	m = 1/Math.sqrt(up * up + j * j + at * at);
	up *= m;
	j *= m;
	at *= m;
	k = h * at - i * j;
	i = i * up - f * at;
	f = f * j - h * up;

	if(m = Math.sqrt(k * k + i * i + f * f)) {
		m = 1/m;
		k *= m;
		i *= m;
		f *= m;
	}
	else f = i = k = 0;
	h = j * f - at * i;
	l = at * k - up * f;
	o = up * i - j * k;

	if(m = Math.sqrt(h * h + l * l + o * o)) {
		m = 1/m;
		h *= m;
		l *= m;
		o *= m;
	}
	else o = l = h = 0;

	pMtrx[0] = k;
	pMtrx[1] = h;
	pMtrx[2] = up;
	pMtrx[3] = 0;
	pMtrx[4] = i;
	pMtrx[5] = l;
	pMtrx[6] = j;
	pMtrx[7] = 0;
	pMtrx[8] = f;
	pMtrx[9] = o;
	pMtrx[10] = at;
	pMtrx[11] = 0;
	pMtrx[12] =-(k * e + i * g + f * eye);
	pMtrx[13] =-(h * e + l * g + o * eye);
	pMtrx[14] =-(up * e + j * g + at * eye);
	pMtrx[15] = 1;

	return pMtrx
};