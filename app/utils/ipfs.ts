export const resolveIPFS = (uri: string) => {
  if (!uri) return '';
  // Convert "ipfs://Qm..." to a public gateway link so the browser can see it
  if (uri.startsWith('ipfs://')) {
    return uri.replace('ipfs://', 'https://ipfs.io/ipfs/');
  }
  return uri;
};

export const fetchMetadata = async (uri: string) => {
  try {
    const url = resolveIPFS(uri);
    const res = await fetch(url);
    const data = await res.json();
    return {
      title: data.name || 'Untitled NFT',
      description: data.description || '',
      image: resolveIPFS(data.image) || 'https://via.placeholder.com/400'
    };
  } catch (err) {
    console.error("Failed to fetch metadata", err);
    return { title: 'Unknown Art', description: '', image: 'https://via.placeholder.com/400' };
  }
};