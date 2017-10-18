
    // Set up the scene, camera, and renderer as global variables.
    var scene, camera, renderer;

    init();
    animate();

    // Sets up the scene.
    function init() {

      // Create the scene and set the scene size.
      scene = new THREE.Scene();
      var WIDTH = document.getElementById('hind').clientWidth,
          HEIGHT = document.getElementById('hind').clientHeight;

      // Create a renderer and add it to the DOM.
      renderer = new THREE.WebGLRenderer({antialias:true});
      renderer.setSize(WIDTH, HEIGHT);
	  canvas = document.getElementById( 'hind' );
	  canvas.appendChild( renderer.domElement );


      // Create a camera, zoom it out from the model a bit, and add it to the scene.
      camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 0.1, 20000);
      camera.position.set(19,15,19);
      scene.add(camera);

      // Create an event listener that resizes the renderer with the browser window.
      window.addEventListener('resize', function() {
        var WIDTH = document.getElementById('hind').offsetWidth,
          HEIGHT = document.getElementById('hind').offsetHeight;
        renderer.setSize(WIDTH, HEIGHT);
        camera.aspect = WIDTH / HEIGHT;
        camera.updateProjectionMatrix();
      });

      // Set the background color of the scene.
      renderer.setClearColor(0x333F47, 1);

      // Create a light, set its position, and add it to the scene.
      var light = new THREE.PointLight(0xffffff);
      light.position.set(100,200,100);
      scene.add(light);

      // Load in the mesh and add it to the scene.
	  
	  var particleMaterial = new THREE.MeshBasicMaterial;
	  particleMaterial.map = new THREE.TextureLoader().load("../maps/singletexture/diffuse_m24_alpha.jpg");
	  particleMaterial.side = THREE.DoubleSide;
	    
      var loader = new THREE.JSONLoader();
      loader.load("../maps/singletexture/untitled.json", function(geometry){
        var mesh = new THREE.Mesh(geometry, particleMaterial);
        scene.add(mesh);
      });

      // Add OrbitControls so that we can pan around with the mouse.
      controls = new THREE.OrbitControls(camera, renderer.domElement);

    }


    // Renders the scene and updates the render as needed.
    function animate() {

      // Read more about requestAnimationFrame at http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
      requestAnimationFrame(animate);
      
      // Render the scene.
      renderer.render(scene, camera);
      controls.update();

    }
