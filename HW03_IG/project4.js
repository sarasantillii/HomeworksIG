// This function takes the projection matrix, the translation, and two rotation angles (in radians) as input arguments.
// The two rotations are applied around x and y axes.
// It returns the combined 4x4 transformation matrix as an array in column-major order.
// The given projection matrix is also a 4x4 matrix stored as an array in column-major order.
// You can use the MatrixMult function defined in project4.html to multiply two 4x4 matrices in the same format.
function GetModelViewProjection( projectionMatrix, translationX, translationY, translationZ, rotationX, rotationY )
{
	// [TO-DO] Modify the code below to form the transformation matrix.
	var trans = [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		translationX, translationY, translationZ, 1
	];

	let cosx = Math.cos(rotationX);
	let sinx = Math.sin(rotationX);
	let cosy = Math.cos(rotationY);
	let siny = Math.sin(rotationY);

	//creation of rotation matrices
	var rotX = [
		1, 0, 0, 0,
    	0, cosx, sinx, 0,
    	0, -sinx, cosx, 0,
 		0, 0, 0, 1
	];
	var rotY = [
		cosy, 0, -siny, 0,
    	0, 1, 0, 0,
    	siny, 0, cosy, 0,
    	0, 0, 0, 1
	];

	//apply the rotations to the translation matrix
	trans = MatrixMult(trans, rotX);
	trans = MatrixMult(trans, rotY);

	var mvp = MatrixMult( projectionMatrix, trans );
	return mvp;
}


// [TO-DO] Complete the implementation of the following class.

class MeshDrawer
{
	// The constructor is a good place for taking care of the necessary initializations.
	constructor()
	{
		// [TO-DO] initializations
		this.prog = InitShaderProgram(meshVS, meshFS);

		this.mvp = gl.getUniformLocation(this.prog, 'mvp');
		this.swap = I;
	
		this.vertPos = gl.getAttribLocation(this.prog, 'pos');
		this.texCoord = gl.getAttribLocation(this.prog, 'txc');

		this.vertBuffer = gl.createBuffer();
		gl.enableVertexAttribArray(this.vertPos);
		
		this.texBuffer = gl.createBuffer();
		gl.enableVertexAttribArray(this.texCoord);
	
		this.texture = gl.createTexture();
		this.sampler = gl.getUniformLocation(this.prog, 'tex');
		this.showTex = gl.getUniformLocation(this.prog, 'showTex');
	}
	
	// This method is called every time the user opens an OBJ file.
	// The arguments of this function is an array of 3D vertex positions
	// and an array of 2D texture coordinates.
	// Every item in these arrays is a floating point value, representing one
	// coordinate of the vertex position or texture coordinate.
	// Every three consecutive elements in the vertPos array forms one vertex
	// position and every three consecutive vertex positions form a triangle.
	// Similarly, every two consecutive elements in the texCoords array
	// form the texture coordinate of a vertex.
	// Note that this method can be called multiple times.
	setMesh( vertPos, texCoords )
	{
		// [TO-DO] Update the contents of the vertex buffer objects.
		this.numTriangles = vertPos.length / 3;

		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertPos), gl.STATIC_DRAW);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
	}
	
	// This method is called when the user changes the state of the
	// "Swap Y-Z Axes" checkbox. 
	// The argument is a boolean that indicates if the checkbox is checked.
	swapYZ( swap )
	{
		// [TO-DO] Set the uniform parameter(s) of the vertex shader

		//swap vectors y-z
		var trans1 = [ 
			1, 0, 0, 0,
      		0, 0, 1, 0,
      		0, 1, 0, 0,
      		0, 0, 0, 1,
		];
		this.swap = swap ? trans1 : I;
	}
	
	// This method is called to draw the triangular mesh.
	// The argument is the transformation matrix, the same matrix returned
	// by the GetModelViewProjection function above.
	draw( trans )
	{
		// [TO-DO] Complete the WebGL initializations before drawing
		gl.useProgram(this.prog);
		gl.uniformMatrix4fv(this.mvp, false, MatrixMult(trans, this.swap));
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuffer);
		gl.vertexAttribPointer(this.vertPos, 3, gl.FLOAT, false, 0, 0);
	
		gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuffer);
		gl.vertexAttribPointer(this.texCoord, 2, gl.FLOAT, false, 0, 0);

		gl.drawArrays( gl.TRIANGLES, 0, this.numTriangles );
	}
	
	// This method is called to set the texture of the mesh.
	// The argument is an HTML IMG element containing the texture data.
	setTexture( img )
	{
		// [TO-DO] Bind the texture
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.texture);

		// You can set the texture image data using the following command.
		gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img );
		gl.generateMipmap(gl.TEXTURE_2D);
    	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

		// [TO-DO] Now that we have a texture, it might be a good idea to set
		// some uniform parameter(s) of the fragment shader, so that it uses the texture.
		gl.useProgram(this.prog);
    	gl.uniform1i(this.sampler, 0);
		gl.uniform1i(this.showTex, 1);
	}
	
	// This method is called when the user changes the state of the
	// "Show Texture" checkbox. 
	// The argument is a boolean that indicates if the checkbox is checked.
	showTexture( show )
	{
		// [TO-DO] set the uniform parameter(s) of the fragment shader to specify if it should use the texture.
		gl.useProgram(this.prog);
    	gl.uniform1i(this.showTex, show);
	}
	
}
var I = [
	1, 0, 0, 0,
	0, 1, 0, 0,
	0, 0, 1, 0,
	0, 0, 0, 1,
  ]

var meshVS = `
	attribute vec3 pos;
	attribute vec2 txc;
  
	uniform mat4 mvp;
  
	varying vec2 texCoord;
  
	void main() {
	  gl_Position = mvp * vec4(pos, 1);
	  texCoord = txc;
	}
`
var meshFS = `
  precision mediump float;

  uniform bool showTex;
  uniform sampler2D tex;
  varying vec2 texCoord;

  void main() {
    if (showTex) {
      gl_FragColor = texture2D(tex, texCoord);
    } else {
      gl_FragColor = vec4(1,gl_FragCoord.z*gl_FragCoord.z,0,1);
    }
  }
`
