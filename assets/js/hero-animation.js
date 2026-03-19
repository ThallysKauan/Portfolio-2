/**
 * ---------------------------------------------------------------------------
 * CONFIGURAÇÕES PARA MODIFICAÇÃO (Mude aqui para ver a mágica!)
 * ---------------------------------------------------------------------------
 */
const CONFIG = {
    quantidade: 63,             // Aumentado em 5% conforme pedido
    corCristal: 0xffffff,       
    corLuz: 0xc4b595,           
    transparencia: 1.0,         
    brilho: 1.6,                // Aumentado levemente para maior visibilidade
    velocidadeRotacao: 0.02,    // O quanto elas giram sozinhas
    espalhamentoScroll: 0.5,    // O quanto elas "explodem" pra fora ao rolar
    distanciaCamera: 15 // Zoom: números maiores = mais longe
};

/**
 * ---------------------------------------------------------------------------
 * CÓDIGO DA ANIMAÇÃO (Dê uma olhada se quiser entender como funciona)
 * ---------------------------------------------------------------------------s
 */

class EtherealAnimation {
    constructor() {
        // 1. ACHA O LUGAR NO HTML: Procura onde o desenho vai ser "pintado"
        this.container = document.getElementById('particles-container');
        if (!this.container) return;

        // 2. CRIA O MUNDO 3D: Pense nisso como o palco, a câmera e o pintor (renderer)
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = CONFIG.distanciaCamera;

        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        this.meshes = [];
        this.mouse = new THREE.Vector2();
        this.targetMouse = new THREE.Vector2();

        this.initLights();
        this.createGeometries();
        this.createCore(); // Adiciona o Núcleo Quântico Central
        this.setupGSAPScroll();
        this.addEventListeners();

        this.animate();
    }

    initLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        this.pointLight = new THREE.PointLight(CONFIG.corLuz, CONFIG.brilho, 60);
        this.pointLight.position.set(0, 0, 5);
        this.scene.add(this.pointLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
        directionalLight.position.set(5, 5, 10);
        this.scene.add(directionalLight);
    }

    createGeometries() {
        const geometries = [
            new THREE.IcosahedronGeometry(1.5, 0),
            new THREE.OctahedronGeometry(1.2, 0),
            new THREE.TetrahedronGeometry(1.4, 0)
        ];

        const material = new THREE.MeshPhysicalMaterial({
            color: CONFIG.corCristal,
            metalness: 0.0,
            roughness: 0.1,
            transmission: 0.95,
            thickness: 1.0,
            clearcoat: 1.0,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: CONFIG.transparencia
        });

        this.group = new THREE.Group();
        this.scene.add(this.group);

        for (let i = 0; i < CONFIG.quantidade; i++) {
            const geometry = geometries[Math.floor(Math.random() * geometries.length)];
            const mesh = new THREE.Mesh(geometry, material);

            // Posição inicial
            const x = (Math.random() - 0.5) * 40;
            const y = (Math.random() - 0.5) * 30;
            const z = (Math.random() - 0.5) * 20 - 10;

            mesh.position.set(x, y, z);
            mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

            const scale = Math.random() * 0.7 + 0.3;
            mesh.scale.set(scale, scale, scale);

            // userData agora separa a posição BASE (que o scroll muda) da posição ORIGINAL
            mesh.userData = {
                basePosition: mesh.position.clone(), // Esta será modificada pelo GSAP
                originalPosition: mesh.position.clone(),
                velocidadeGiro: {
                    x: (Math.random() - 0.5) * CONFIG.velocidadeRotacao,
                    y: (Math.random() - 0.5) * CONFIG.velocidadeRotacao
                },
                pesoParalaxe: Math.random() * 0.6 + 0.2
            };

            this.meshes.push(mesh);
            this.group.add(mesh);
        }
    }

    createCore() {
        this.coreGroup = new THREE.Group();
        this.scene.add(this.coreGroup);

        // 1. Núcleo Sólido (Icosaedro)
        const coreGeo = new THREE.IcosahedronGeometry(2, 0);
        const coreMat = new THREE.MeshPhysicalMaterial({
            color: CONFIG.corCristal,
            metalness: 0.2,
            roughness: 0.1,
            transmission: 0.95,
            thickness: 2.0,
            transparent: true,
            opacity: 1
        });
        this.coreMesh = new THREE.Mesh(coreGeo, coreMat);
        this.coreGroup.add(this.coreMesh);

        // 2. Estrutura Wireframe (Edge highlights)
        const wireGeo = new THREE.IcosahedronGeometry(2.1, 0);
        const wireMat = new THREE.MeshBasicMaterial({
            color: CONFIG.corLuz,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        this.coreWire = new THREE.Mesh(wireGeo, wireMat);
        this.coreGroup.add(this.coreWire);

        // 3. Anéis Orbitais
        this.rings = [];
        const ringMat = new THREE.MeshBasicMaterial({ color: CONFIG.corLuz, transparent: true, opacity: 0.4, side: THREE.DoubleSide });
        for (let i = 0; i < 3; i++) {
            const ringGeo = new THREE.TorusGeometry(3.5 + i * 0.8, 0.02, 16, 100);
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.rotation.x = (Math.PI / 4) + (i * 0.5); // Inclinação diagonal
            ring.rotation.y = (Math.PI / 4);
            this.coreGroup.add(ring);
            this.rings.push(ring);
        }

        // 4. Nuvem de Partículas do Núcleo
        const particlesGeo = new THREE.BufferGeometry();
        const particlesCount = 200;
        const posArray = new Float32Array(particlesCount * 3);
        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 10;
        }
        particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particlesMat = new THREE.PointsMaterial({
            size: 0.05,
            color: CONFIG.corLuz,
            transparent: true,
            opacity: 0.8
        });
        this.coreParticles = new THREE.Points(particlesGeo, particlesMat);
        this.coreGroup.add(this.coreParticles);

        this.coreGroup.position.set(0, 0, 2); // Centralizado no herói
        this.coreGroup.scale.set(2.2, 2.2, 2.2); // Bem maior, como solicitado
        
        this.coreGroup.userData = {
            basePosition: this.coreGroup.position.clone()
        };
    }

    setupGSAPScroll() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        // O GSAP agora altera a 'basePosition' dentro do userData de cada mesh
        // Isso evita que elas tentem voltar pro centro original
        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: ".scene1",
                start: "top top",
                endTrigger: "#projetos",
                end: "bottom center",
                scrub: 2,
            }
        });

        this.meshes.forEach((mesh) => {
            // Fator de espalhamento bem maior para ocupar a tela toda
            const spreadFactor = 3.5;

            timeline.to(mesh.userData.basePosition, {
                x: mesh.userData.basePosition.x * spreadFactor,
                y: mesh.userData.basePosition.y * spreadFactor,
                z: mesh.userData.basePosition.z + 15,
                ease: "power2.inOut"
            }, 0);

            timeline.to(mesh.rotation, {
                x: mesh.rotation.x + Math.PI * 2,
                y: mesh.rotation.y + Math.PI * 2,
                ease: "none"
            }, 0);
        });

        // O Core agora SOBE com força para acompanhar as letras saindo da tela
        if (this.coreGroup) {
            timeline.to(this.coreGroup.userData.basePosition, {
                y: 40, // Dobrado a distância de subida para não "ficar abaixando" ao rolar
                ease: "none"
            }, 0);

            // Apenas os anéis e partículas desaparecem, a esfera (coreMesh) continua visível
            timeline.to([this.coreWire.material, this.coreParticles.material], {
                opacity: 0,
                ease: "power1.in"
            }, 0);

            this.rings.forEach(ring => {
                timeline.to(ring.material, {
                    opacity: 0,
                    ease: "power1.in"
                }, 0);
            });
        }
    }

    addEventListeners() {
        window.addEventListener('mousemove', (e) => {
            this.targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;

        this.pointLight.position.x = this.mouse.x * 15;
        this.pointLight.position.y = this.mouse.y * 15;

        this.meshes.forEach((mesh) => {
            mesh.rotation.x += mesh.userData.velocidadeGiro.x;
            mesh.rotation.y += mesh.userData.velocidadeGiro.y;

            // Paralaxe Baseado na posição ATUAL do scroll (basePosition)
            const paralaxeX = this.mouse.x * 3 * mesh.userData.pesoParalaxe;
            const paralaxeY = this.mouse.y * 3 * mesh.userData.pesoParalaxe;

            // Suavização em direção à basePosition (que é movida pelo scroll) + efeito mouse
            mesh.position.x += ((mesh.userData.basePosition.x + paralaxeX) - mesh.position.x) * 0.1;
            mesh.position.y += ((mesh.userData.basePosition.y + paralaxeY) - mesh.position.y) * 0.1;
            mesh.position.z += (mesh.userData.basePosition.z - mesh.position.z) * 0.1;
        });

        if (this.coreGroup) {
            // Rotação complexa do Core
            this.coreMesh.rotation.y += 0.01;
            this.coreMesh.rotation.x += 0.005;
            this.coreWire.rotation.y -= 0.015;
            
            // Anéis girando em velocidades diferentes
            this.rings.forEach((ring, i) => {
                ring.rotation.z += 0.01 * (i + 1);
                ring.rotation.x += 0.005 * (i + 1);
            });

            // Partículas orbitais (respiração mais sutil para parecer "estático")
            this.coreParticles.rotation.y += 0.002;
            const float = Math.sin(Date.now() * 0.001) * 0.1; // Flutuação reduzida para mais estabilidade
            
            const kParalaxeX = this.mouse.x * 0.5;
            const kParalaxeY = this.mouse.y * 0.5;
            
            this.coreGroup.position.y += ((this.coreGroup.userData.basePosition.y + kParalaxeY + float) - this.coreGroup.position.y) * 0.1;

            // Atualizar Coordenadas no HUD
            const coordX = document.getElementById('coord-x');
            const coordY = document.getElementById('coord-y');
            if (coordX && coordY) {
                coordX.innerText = this.mouse.x.toFixed(2);
                coordY.innerText = this.mouse.y.toFixed(2);
            }
        }

        this.renderer.render(this.scene, this.camera);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new EtherealAnimation();
});
