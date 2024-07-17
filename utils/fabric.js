let fabric = null;

export async function getFabric() {
  if (fabric) return fabric;

  const fabricModule = await import("fabric");
  fabric = fabricModule.fabric;
  return fabric;
}
