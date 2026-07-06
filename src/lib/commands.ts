/**
 * Generates the server-side delivery commands based on the items purchased
 */
export function getDeliveryCommands(rawIgn: string, items: string[]): string[] {
  const ign = rawIgn.split(" ")[0]; // Parse out any suffixes like (UTR: ...)
  const commands: string[] = [];
  
  items.forEach(item => {
    const lower = item.toLowerCase();
    
    // Ranks
    if (lower.includes("knight")) commands.push(`/lp user ${ign} parent add knight`);
    else if (lower.includes("lord")) commands.push(`/lp user ${ign} parent add lord`);
    else if (lower.includes("paladin")) commands.push(`/lp user ${ign} parent add paladin`);
    else if (lower.includes("duke")) commands.push(`/lp user ${ign} parent add duke`);
    else if (lower.includes("king")) commands.push(`/lp user ${ign} parent add king`);

    // Crates
    if (lower.includes("party")) {
      const qty = parseInt(lower.match(/\d+/) ? lower.match(/\d+/)![0] : "1");
      commands.push(`/crazycrates give physical party ${qty} ${ign}`);
    }
    else if (lower.includes("spawner")) {
      const qty = parseInt(lower.match(/\d+/) ? lower.match(/\d+/)![0] : "1");
      commands.push(`/crazycrates give physical spawner ${qty} ${ign}`);
    }
    else if (lower.includes("rare")) {
      const qty = parseInt(lower.match(/\d+/) ? lower.match(/\d+/)![0] : "1");
      commands.push(`/crazycrates give physical rare ${qty} ${ign}`);
    }
    else if (lower.includes("epic")) {
      const qty = parseInt(lower.match(/\d+/) ? lower.match(/\d+/)![0] : "1");
      commands.push(`/crazycrates give physical epic ${qty} ${ign}`);
    }

    // Coins
    if (lower.includes("coin")) {
      const qtyStr = lower.replace(/[^0-9]/g, "");
      const qty = qtyStr ? parseInt(qtyStr) : 500;
      commands.push(`/points give ${ign} ${qty}`);
    }
  });

  return commands.length > 0 ? commands : [`# No commands found`];
}
