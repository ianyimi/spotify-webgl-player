precision highp float;
out highp vec4 pc_fragColor;
uniform float time;
uniform float active_scene;
uniform float uCircleScale;
uniform float screenAspect;
uniform sampler2D diffuse;
uniform sampler2D past;
uniform sampler2D present;
uniform sampler2D future;
in vec2 vUv;

// based on https://www.shadertoy.com/view/llGXzR
float radial(vec2 pos, float radius)
{
  float result = length(pos)-radius;
  result = fract(result*1.0);
  float result2 = 1.0 - result;
  float fresult = result * result2;
  fresult = pow((fresult*3.), 7.);
  return fresult;
}

float circle(vec2 uv, float radius, float sharp) {
  vec2 tempUV = uv - vec2(0.5);

  return smoothstep(
  radius - radius * sharp,
  radius + radius * sharp,
  dot(tempUV, tempUV)*4.0
  );
}

void main() {
  vec2 c_uv = vUv * 2.0 - 1.0;
  vec2 o_uv = vUv * 0.8;
  float gradient = radial(c_uv, time*1.8);
  vec2 fuv = mix(vUv, o_uv, gradient);

  vec2  centerVec = vUv - vec2(0.5);

  vec4 home = texture(diffuse, vUv);
  vec4 play = texture(future, vUv);


  vec2 circleUV = (vUv - vec2(0.5))*vec2(screenAspect, 1.) + vec2(0.5);
  float circleProgress = circle(circleUV, uCircleScale, 0.25 + 0.25*uCircleScale);



  pc_fragColor = home;

  if (active_scene == 2.0) {
    play = texture(future, fuv);

    vec4 final = mix(play, home, circleProgress);
    pc_fragColor = final;
    //    pc_fragColor.rgb = mix(pc_fragColor.rgb, scene_color.rgb, gradient);
  }
  //  pc_fragColor2 = texture(future_scene, fuv);
  //  pc_fragColor = texture(diffuse, fuv);
}
