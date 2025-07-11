#include <begin_vertex>

// 让模型发生和高度正相关的扭曲
// 但是这种扭曲不会影响到阴影
 float angle = (sin(position.y + uTime)) * 0.4;
mat2 rotationMatrix = get2dRotationMatrix(angel);
transformed.xz = rotationMatrix * transformed.xz;