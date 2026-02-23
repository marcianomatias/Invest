import { Asset } from "../types";

/**
 * Simulates fetching real-time data from a financial API (like Brapi or HG Brasil).
 * In a real-world scenario, you would use:
 * fetch(`https://brapi.dev/api/quote/${tickers.join(',')}?token=${process.env.VITE_BRAPI_TOKEN}`)
 */
export async function fetchUpdatedPrices(assets: Asset[]): Promise<Asset[]> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return assets.map((asset) => {
    // Simulate a small price fluctuation (-1% to +1%)
    const fluctuation = 1 + (Math.random() * 0.02 - 0.01);
    const newPrice = asset.price * fluctuation;
    const newChange = ((newPrice - (asset.price / (1 + asset.change / 100))) / (asset.price / (1 + asset.change / 100))) * 100;

    return {
      ...asset,
      price: Number(newPrice.toFixed(2)),
      change: Number(newChange.toFixed(2)),
      // Update history with the new price point
      history: [...asset.history.slice(1), { date: new Date().toISOString(), price: newPrice }]
    };
  });
}
