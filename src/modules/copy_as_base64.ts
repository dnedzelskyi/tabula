export async function copyAsBase64Click(): Promise<void> {
  const htmlContent = document.documentElement.outerHTML;
  const base64Content = btoa(htmlContent);

  try {
    await navigator.clipboard.writeText(base64Content);
    alert('Successfully copied to clipboard.');
  } catch (err) {
    alert(`Failed to copy: ${err}`);
  }
}
