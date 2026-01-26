// credits @Z_Z (in discord)
#pragma pattern_limit 16777216

struct Vector3B {
    s8 x;
    s8 y;
    s8 z;
};

struct Vector3US {
    u16 x;
    u16 y;
    u16 z;
};

struct Vector3F {
    float x;
    float y;
    float z;
};

enum SignalTypes : u8 { // not used in format
    NONE = 0,
    Execute = 1,
    Float = 2,
    FloatPtr = 3,
    Vec3 = 4,
    Vec3Ptr = 5,
    Quat = 6,
    QuatPtr = 7,
    Bool = 8,
    BoolPtr = 9,
    Object = 10,
    ObjectPtr = 11,
    Constraint = 12,
    ConstraintPtr = 13,
    String = 14
};

struct BSString {
    u8 length;
    char string[length];
};

bitfield PHeader {
    hasConnections : 1;
    hasSettings : 1;
    hasBlocks : 1;
    hasVoxels : 1;
    isInGroup : 1;
    notBoxCollider : 1;
    unEditable : 1;
    unEditable2 : 1;
    nonDefaultBackgroundColor : 1;
    hasData2 : 1;
    hasData1 : 1;
    nonDefaultName : 1;
    notNormalType : 1;
}[[single_color]];

enum PrefabTypes : u8 {
    Normal = 0, // not used, because usually its defined with notNormalType = 0
    Physics = 1,
    Script = 2,
    Level = 3
};


enum ColliderTypes : u8 {
    None = 0,
    Box = 1, // not used, because usually its defined with notBoxCollider = 0
    Sphere = 2,
    Surface = 3, // assumption from decompiled strings
    Exact = 4 // assumption from decompiled strings
};


//official color names.
enum ColorNames : u8 {
    None          = 0x00,
    Dark_Gray     = 0x01,
    Gray          = 0x02,
    Light_Gray    = 0x03,
    Dark_Silver   = 0x04,
    Silver        = 0x05,
    Light_Silver  = 0x06,
    Dark_Brown    = 0x07,
    Brown         = 0x08,
    Light_Brown   = 0x09,
    Dark_Beige    = 0x0A,
    Beige         = 0x0B,
    Light_Beige   = 0x0C,
    Dark_Red      = 0x0D,
    Red           = 0x0E,
    Light_Red     = 0x0F,
    Dark_Orange   = 0x10,
    Orange        = 0x11,
    Light_Orange  = 0x12,
    Dark_Yellow   = 0x13,
    Yellow        = 0x14,
    Light_Yellow  = 0x15,
    Dark_Green    = 0x16,
    Green         = 0x17,
    Light_Green   = 0x18,
    Dark_Blue     = 0x19,
    Blue          = 0x1A,
    Light_Blue    = 0x1B,
    Dark_Purple   = 0x1C,
    Purple        = 0x1D,
    Light_Purple  = 0x1E,
    Dark_Magenta  = 0x1F,
    Magenta       = 0x20,
    Light_Magenta = 0x21
};

bitfield Face {
    color : 7;
    unglue : 1;
};

struct Faces {
    u8 FacesXP[8*8*8][[single_color]];
    u8 FacesXM[8*8*8][[single_color]];
    u8 FacesYP[8*8*8][[single_color]];
    u8 FacesYM[8*8*8][[single_color]];
    u8 FacesZP[8*8*8][[single_color]];
    u8 FacesZM[8*8*8][[single_color]];
};

enum SettingTypes : u8 {
    Byte = 1,
    Ushort = 2,
    Int = 3,
    Float = 4,
    Vec3 = 5,
    String = 6,
};

struct PrefabSetting {
    u8 value_index;
    SettingTypes type;
    Vector3US pos;
    match (type) {
        (SettingTypes::Byte): u8 value;
        (SettingTypes::Ushort): u16 value;
        (SettingTypes::Int): s32 value;
        (SettingTypes::Float): float value;
        (SettingTypes::Vec3): Vector3F value;
        (SettingTypes::String): {
            BSString value;
        }
        (_): {
            BSString value;
        }
    }
};

struct PConnection {
    Vector3US fromVec;
    Vector3US toVec;
    Vector3US fromVoxel;
    Vector3US toVoxel;
};

struct Prefab {
    PHeader Header;
    if (Header.notNormalType)
        PrefabTypes Type;
    if (Header.nonDefaultName) {
        BSString Name;
    }
    if (Header.hasData1)
        u8 Data1;
    if (Header.hasData2)
        u32 Data2;
    if (Header.nonDefaultBackgroundColor)
        u8 BackgroundColor;
    if (Header.notBoxCollider)
        ColliderTypes collider;
    if (Header.isInGroup) {
        u16 GroupId;
        Vector3B PosInGroup;
    }
    if (Header.hasVoxels) 
        Faces tile_faces;
    if (Header.hasBlocks) {
        Vector3US insideSize;
        u16 tiles[insideSize.x * insideSize.y * insideSize.z];
    }
    if (Header.hasSettings) {
        u16 SettingsCount;
        PrefabSetting Settings[SettingsCount];
    }
    if (Header.hasConnections) {
        u16 ConnectionCount;
        PConnection Connections[ConnectionCount];
    }
};

struct FancadeGame {
    u16 CurrentFileVersion;
    BSString Name;
    BSString Author;
    BSString Desc;
    u16 CurrentNumbStockPrefabs; // aka iOffset
    u16 PrefabCount;
    Prefab Prefabs[PrefabCount];
};

FancadeGame game @ 0x00;