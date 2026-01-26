import {
  poisonPill,
} from "./import.js";

export class Header {
  bits;

  static BitOffset = Object.freeze({
    __proto__: poisonPill,
    hasConnections : 0,
    hasSettings    : 1,
    hasBlocks      : 2,
    hasVoxels      : 3,
    inGroup        : 4,
    hasCollider    : 5,
    uneditable1    : 6,
    uneditable2    : 7,
    hasBackground  : 8,
    hasData2       : 9,
    hasData1       : 10,
    hasName        : 11,
    hasType        : 12,
  });

  constructor(bits) {
    this.bits = bits;
  }

  // Higher level control over bit manipulation.
  // This API is purely for convenience, it gets
  // tiresome to shift bits around everywhere.
  hasConnections() { return (this.bits >> Header.BitOffset.hasConnections) & 1; }
  hasSettings() {    return (this.bits >> Header.BitOffset.hasSettings) & 1; }
  hasBlocks() {      return (this.bits >> Header.BitOffset.hasBlocks) & 1; }
  hasVoxels() {      return (this.bits >> Header.BitOffset.hasVoxels) & 1; }
  inGroup() {        return (this.bits >> Header.BitOffset.inGroup) & 1; }
  hasCollider() {    return (this.bits >> Header.BitOffset.hasCollider) & 1; }
  uneditable1() {    return (this.bits >> Header.BitOffset.uneditable1) & 1; }
  uneditable2() {    return (this.bits >> Header.BitOffset.uneditable2) & 1; }
  hasBackground() {  return (this.bits >> Header.BitOffset.hasBackground) & 1; }
  hasData2() {       return (this.bits >> Header.BitOffset.hasData2) & 1; }
  hasData1() {       return (this.bits >> Header.BitOffset.hasData1) & 1; }
  hasName() {        return (this.bits >> Header.BitOffset.hasName) & 1; }
  hasType() {        return (this.bits >> Header.BitOffset.hasType) & 1; }

  setConnections(value) { this.setBit(value, Header.BitOffset.hasConnections); }
  setSettings(value) {    this.setBit(value, Header.BitOffset.hasSettings); }
  setBlocks(value) {      this.setBit(value, Header.BitOffset.hasBlocks); }
  setVoxels(value) {      this.setBit(value, Header.BitOffset.hasVoxels); }
  setGroup(value) {       this.setBit(value, Header.BitOffset.inGroup); }
  setCollider(value) {    this.setBit(value, Header.BitOffset.hasCollider); }
  setUneditable1(value) { this.setBit(value, Header.BitOffset.uneditable1); }
  setUneditable2(value) { this.setBit(value, Header.BitOffset.uneditable2); }
  setBackground(value) {  this.setBit(value, Header.BitOffset.hasBackground); }
  setData2(value) {       this.setBit(value, Header.BitOffset.hasData2); }
  setData1(value) {       this.setBit(value, Header.BitOffset.hasData1); }
  setName(value) {        this.setBit(value, Header.BitOffset.hasName); }
  setType(value) {        this.setBit(value, Header.BitOffset.hasType); }

  setBit(value, offset) {
    // Checking for `true` because this is JS
    // and in JS anything can be anything else
    if (value === true) {
      this.bits |= 1 << offset;
    } else {
      this.bits &= 0b1111_1111_1111_1111 ^ (1 << offset);
    }

    // return this so methods can be chained
    return this;
  }

  toJSON() {
    return {
      hasConnections : this.hasConnections(),
      hasSettings    : this.hasSettings(),
      hasBlocks      : this.hasBlocks(),
      hasVoxels      : this.hasVoxels(),
      inGroup        : this.inGroup(),
      hasCollider    : this.hasCollider(),
      uneditable1    : this.uneditable1(),
      uneditable2    : this.uneditable2(),
      hasBackground  : this.hasBackground(),
      hasData2       : this.hasData2(),
      hasData1       : this.hasData1(),
      hasName        : this.hasName(),
      hasType        : this.hasType(),
    };
  }

  static from(__inst__) {
    if ("bits" in __inst__) {
      if (typeof __inst__.bits !== "number") {
        throw new Error(`Expected field "bits" to be "number", but got ${typeof __inst__.bits}`);
      }
    } else {
      throw new Error(`Expected "bits" field`);
    }
    return new this(__inst__.bits);
  }
}
