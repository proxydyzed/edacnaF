export default class Setting {
  index;    // u8
  type;     // u8
  position; // vec3u16
  value;    // u8 | u16 | i32 | f32 | vec3f32 | string
}
