import React, { useEffect } from 'react';

const HeroShader = () => {
    useEffect(() => {
        // We wrap your exact script in a small timeout to guarantee the DOM 
        // has fully painted the HTML before the script tries to measure it.
        const timer = setTimeout(() => {
            if (window.innerWidth >= 768) {
                const canvas = document.querySelector(".shader-canvas");
                if (!canvas) return;

                function updatePath() {
                    const blurFilter = document.querySelector("#hero-deviation");
                    if (blurFilter) {
                        if (window.innerWidth <= 991) {
                            blurFilter.setAttribute("stdDeviation", "10");
                        } else {
                            blurFilter.setAttribute("stdDeviation", "20");
                        }
                    }

                    const parent = document.querySelector(".am-shader-container");
                    const path = document.getElementById("dynamic-path");
                    const img = document.querySelector(".am-rocket-illustration");

                    if (canvas.parentElement) {
                        canvas.style.backgroundColor = canvas.parentElement.getAttribute("data-bg-color");
                    }

                    const rect = parent.getBoundingClientRect();
                    const width = rect.width;
                    const height = rect.height;
                    const blur = 40;

                    canvas.style.opacity = 1;
                    canvas.style.transform = "scale3d(1, 1, 1) translate3d(0vw, 0vh, 0)";
                    img.style.opacity = 1;
                    img.style.transform = "scale3d(1, 1, 1) translate3d(0vw, 0vh, 0)";

                    img.style.width = width * 0.3019 + "px";

                    // Calculate path coordinates
                    const x1 = 0.955 * width;
                    const y1 = 0.4 * height;
                    const x2 = 0.967 * width;
                    const y2 = 0.43 * height;
                    const cx1 = 0.7 * width;
                    const cy1 = 0.75 * height;
                    const cx2 = 0.31 * width;
                    const cy2 = 0.89 * height;
                    const y3 = height - blur;
                    const x3 = 0.2 * width;
                    const y4 = 0.39 * height;
                    const cx3 = 0.71 * width;
                    const cy3 = 0.49 * height;
                    const x4 = 0.94 * width;
                    const y5 = 0.36 * height;

                    const pathData = `M${x1},${y1} L${x2},${y2} C${cx1},${cy1},${cx2},${cy2},0,${y3} V${blur} C${x3},${y4},${cx3},${cy3},${x4},${y5}Z`;

                    if (path) {
                        path.setAttribute("d", pathData);
                    }

                    // Apply mask after updating the path
                    canvas.style.webkitMaskImage = "url(#rocket-mask)";
                    canvas.style.maskImage = "url(#rocket-mask)";
                    canvas.style.webkitMaskSize = "100% 100%";
                    canvas.style.maskSize = "100% 100%";
                    canvas.style.webkitMaskRepeat = "no-repeat";
                    canvas.style.maskRepeat = "no-repeat";

                    if (window.innerWidth > 1800) {
                        if (path) path.classList.add("has-fade-gradient");
                    } else {
                        if (path) path.classList.remove("has-fade-gradient");
                    }
                }

                window.addEventListener("resize", updatePath);
                window.addEventListener("load", updatePath);

                // Trigger initial update
                updatePath();

                const vertexShaderSource = `
                    attribute vec3 aPosition;
                    void main() {
                        vec4 positionVec4 = vec4(aPosition, 1.0);
                        positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
                        gl_Position = positionVec4;
                    }
                `;

                const fragmentShaderSource = `
                    #ifdef GL_ES
                    precision highp float;
                    #endif
                    #define PI 3.14159265359
                    #define TWO_PI 6.28318530718
                    uniform vec2 u_resolution;
                    uniform float u_time;
                    uniform vec2 u_mouse;
                    uniform float u_dpr;
                    uniform vec3 u_col1;
                    uniform vec3 u_col2;
                    uniform vec3 u_col3;
                    uniform vec3 u_col4;

                    float rand(vec2 co){
                        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453) / u_dpr;
                    }

                    float map(float value, float min1, float max1, float min2, float max2) {
                        return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
                    }

                    vec4 circle(vec2 st, vec2 center, float radius, float blur, vec3 col){
                        float dist = distance(st,center)*2.0;
                        vec4 f_col = vec4(1.0-smoothstep(radius, radius + blur, dist));
                        f_col.r *= col.r;
                        f_col.g *= col.g;
                        f_col.b *= col.b;
                        return f_col;
                    }

                    void main(){
                        vec2 fst = gl_FragCoord.xy/u_resolution.xy;
                        float aspect = u_resolution.x/u_resolution.y;
                        vec2 pst = fst * vec2(aspect, 1.);
                        vec2 mst = fst;
                        vec2 m = u_mouse.xy/u_resolution.xy;

                        vec3 col1 = u_col1 / 255.;
                        vec3 col2 = u_col2 / 255.;
                        vec3 col3 = u_col3 / 255.;

                        vec4 color = vec4(0.);

                        vec2 purpleC = vec2(m.x, 1.-m.y);
                        float purpleR = .75;
                        float purpleB = .75;
                        vec3 purpleCol = col1;

                        vec2 mintC = vec2(.5+sin(u_time*.4)*.5*cos(u_time*.2)*.5, .5+sin(u_time*.3)*.5*cos(u_time*.5)*.5);
                        float mintR = 1.;
                        float mintB = 1.;
                        vec3 mintCol = col2;

                        vec2 greenC = vec2((.5+cos(u_time*.5)*.5*sin(u_time*.2)*.5)*aspect, .5+cos(u_time*.4)*(.5)*sin(u_time*.3)*.5);
                        float greenR = 1.;
                        float greenB = 1.;
                        vec3 greenCol = col3;

                        pst.x += sin(u_time*.15+pst.x*19.)*.37 * cos(u_time*.46+pst.y*25.)*.28;
                        pst.y += cos(u_time*.27+pst.x*4.)*.45 * sin(u_time*.24+pst.y*8.)*.22;

                        mst.x += cos(u_time*.37+mst.x*15.)*.21 * sin(u_time*.14+mst.y*7.)*.29 * (m.x - .5) * 12.;
                        mst.y += sin(u_time*.15+mst.x*13.)*.37 * cos(u_time*.36+mst.y*5.)*.12 * (m.y - .5) * 12.;

                        vec4 color1 = vec4(0.);
                        vec4 color2 = vec4(0.);
                        vec4 color3 = vec4(0.);
                        vec4 color4 = vec4(0.);
                        vec4 color5 = vec4(0.);

                        color1 += vec4((circle(mst, mintC, mintR, mintB, vec3(1.)) - circle(mst, mintC, mintR, mintB, vec3(1.)) * circle(mst, greenC, greenR, greenB, vec3(1.))));
                        color2 += vec4((circle(mst, mintC, mintR, mintB, vec3(1.)) - circle(mst, mintC, mintR, mintB, vec3(1.)) * circle(mst, purpleC, purpleR, purpleB, vec3(1.))));

                        color1 -= color1 * color2;
                        color2 -= color1 * color2;

                        color3 = color1;
                        color4 = color2;
                        color3.rgb *= purpleCol;
                        color4.rgb *= greenCol;

                        color += color3;
                        color += color4;

                        color5 += vec4((circle(mst, greenC, greenR, greenB, vec3(1.)) - circle(mst, greenC, greenR, greenB, vec3(1.)) * circle(mst, mintC, mintR, mintB, vec3(1.))));
                        color5 -= color1 * color2;
                        color5.rgb *= mintCol;
                        color += color5;

                        color += circle(mst, mintC, mintR, mintB, mintCol) * (color1 - circle(mst, mintC, mintR, mintB, vec3(1.))) * (color2 - circle(mst, mintC, mintR, mintB, vec3(1.)));

                        float noise = rand(fst*10.) * .2;
                        color.rgb *= 1. - vec3(noise);
                        gl_FragColor = color;
                    }
                `;

                let gl = canvas.getContext("webgl");
                const m = { x: 0, y: 0 };

                if (!gl) {
                    console.warn("WebGL not supported, falling back on experimental-webgl");
                    gl = canvas.getContext("experimental-webgl");
                }

                if (!gl) {
                    console.error("Your browser does not support WebGL");
                    return;
                }

                function createShader(gl, type, source) {
                    const shader = gl.createShader(type);
                    gl.shaderSource(shader, source);
                    gl.compileShader(shader);
                    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
                    if (success) {
                        return shader;
                    }
                    console.log(gl.getShaderInfoLog(shader));
                    gl.deleteShader(shader);
                }

                const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
                const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

                function createProgram(gl, vertexShader, fragmentShader) {
                    const program = gl.createProgram();
                    gl.attachShader(program, vertexShader);
                    gl.attachShader(program, fragmentShader);
                    gl.linkProgram(program);
                    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
                    if (success) {
                        return program;
                    }
                    console.log(gl.getProgramInfoLog(program));
                    gl.deleteProgram(program);
                }

                const program = createProgram(gl, vertexShader, fragmentShader);
                const positionAttributeLocation = gl.getAttribLocation(program, "aPosition");
                const positionBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

                const positions = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1];
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

                function resizeCanvasToDisplaySize(canvas) {
                    const displayWidth = canvas.clientWidth;
                    const displayHeight = canvas.clientHeight;
                    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
                        canvas.width = displayWidth;
                        canvas.height = displayHeight;
                    }
                }

                const u_resolution = gl.getUniformLocation(program, "u_resolution");
                const u_time = gl.getUniformLocation(program, "u_time");
                const u_mouse = gl.getUniformLocation(program, "u_mouse");
                const u_dpr = gl.getUniformLocation(program, "u_dpr");
                const u_col1 = gl.getUniformLocation(program, "u_col1");
                const u_col2 = gl.getUniformLocation(program, "u_col2");
                const u_col3 = gl.getUniformLocation(program, "u_col3");

                const shaderParent = document.querySelector(".am-shader-code.is-hero");
                const col1 = shaderParent.getAttribute("data-color-1");
                const col2 = shaderParent.getAttribute("data-color-2");
                const col3 = shaderParent.getAttribute("data-color-3");

                let startTime = Date.now();
                let mouse = [0, 0];
                window.addEventListener("mousemove", (e) => {
                    mouse[0] = e.clientX;
                    mouse[1] = e.clientY;
                });

                function render() {
                    resizeCanvasToDisplaySize(gl.canvas);
                    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
                    gl.clearColor(0, 0, 0, 0);
                    gl.clear(gl.COLOR_BUFFER_BIT);
                    gl.useProgram(program);

                    gl.enableVertexAttribArray(positionAttributeLocation);
                    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
                    const size = 2;
                    const type = gl.FLOAT;
                    const normalize = false;
                    const stride = 0;
                    const offset = 0;
                    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

                    m.x += (mouse[0] - m.x) * 0.025;
                    m.y += (mouse[1] - m.y) * 0.025;

                    const resolution = [gl.canvas.width, gl.canvas.height];
                    gl.uniform2fv(u_resolution, resolution);
                    gl.uniform1f(u_time, (Date.now() - startTime) * 0.0025);
                    gl.uniform2fv(u_mouse, [m.x, m.y]);
                    gl.uniform1f(u_dpr, window.devicePixelRatio || 1);

                    const col1split = col1.split(",");
                    const col1a = col1split.map(Number);
                    gl.uniform3fv(u_col1, col1a);

                    const col2split = col2.split(",");
                    const col2a = col2split.map(Number);
                    gl.uniform3fv(u_col2, col2a);

                    const col3split = col3.split(",");
                    const col3a = col3split.map(Number);
                    gl.uniform3fv(u_col3, col3a);

                    const primitiveType = gl.TRIANGLES;
                    const count = 6;
                    gl.drawArrays(primitiveType, 0, count);

                    requestAnimationFrame(render);
                }

                requestAnimationFrame(render);

                window.addEventListener("resize", () => {
                    resizeCanvasToDisplaySize(canvas);
                    const resolution = [gl.canvas.width, gl.canvas.height];
                    gl.uniform2fv(u_resolution, resolution);
                });
            }
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0 ">
            <div className="am-shader-container mt-0" style={{ position: "relative", width: "100%", height: "100%" }}>
                <img
                    src="/rocket.avif"
                    loading="eager"
                    width="387"
                    height="Auto"
                    alt=""
                    className="am-rocket-illustration"
                    style={{
                        position: "absolute",
                        opacity: 1,
                        transform: "scale3d(1, 1, 1) translate3d(0vw, 0vh, 0px)",
                        width: "280.19px",
                        top: "10%",
                        right: "0%",
                        zIndex: 4
                    }}
                />
                <div
                    data-bg-color="#E8400D"
                    data-color-1="232,64,13"
                    data-color-2="255,238,216"
                    data-color-3="208,178,255"
                    className="am-shader-code is-hero w-embed w-script"
                    style={{ position: "absolute", top: 0, left: "-10%", width: "100%", height: "100%" }}
                >
                    <style>{`
                        .shader-canvas {
                            width: 100%;
                            height: 100%;
                            display: block;
                            background-color: black;
                            -webkit-mask-image: url(#rocket-mask);
                            mask-image: url(#rocket-mask);
                            -webkit-mask-size: contain;
                            mask-size: contain;
                            -webkit-mask-repeat: no-repeat;
                            mask-repeat: no-repeat;
                            opacity: 0;
                        }
                        .hero-mask {
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            pointer-events: none;
                        }
                        .has-fade-gradient {
                            fill: url(#fade-gradient);
                        }
                    `}</style>
                    <canvas
                        className="shader-canvas"
                        width="942"
                        height="640"
                        style={{
                            backgroundColor: "rgb(232, 64, 13)",
                            opacity: 1,
                            transform: "scale3d(1, 1, 1) translate3d(0vw, 0vh, 0px)",
                            maskImage: 'url("#rocket-mask")',
                            maskSize: "100% 100%",
                            maskRepeat: "no-repeat"
                        }}
                    ></canvas>
                    <svg className="hero-mask" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <filter id="blur-canvas" x="-10%" y="-10%" width="120%" height="120%">
                                <feGaussianBlur id="hero-deviation" stdDeviation="20"></feGaussianBlur>
                            </filter>
                            <linearGradient id="fade-gradient" x1="0%" y1="0%" x2="20%" y2="0%">
                                <stop offset="10%" style={{ stopColor: "white", stopOpacity: 0 }}></stop>
                                <stop offset="100%" style={{ stopColor: "white", stopOpacity: 1 }}></stop>
                            </linearGradient>
                            <mask id="rocket-mask" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse">
                                <path id="dynamic-path" fill="white" filter="url(#blur-canvas)" d="M886.3235858154296,252.08500976562502 L897.4606361083984,270.9913854980469 C649.6612670898437,472.6593933105469,287.7071325683594,560.8891467285156,0,590.2125244140625 V40 C185.6175048828125,245.7828845214844,658.9421423339843,308.8041369628906,872.4022729492187,226.87650878906248Z"></path>
                            </mask>
                        </defs>
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default HeroShader;