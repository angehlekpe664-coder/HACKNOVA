import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, image, url }) => {
  const siteName = "BRAND.AI";
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} | Identité de Marque augmentée par l'IA`;
  const metaDescription = description || "BRAND.AI - L'intelligence artificielle au service de votre identité de marque. Générez des logos, des slogans et des stratégies d'entrepreneuriat en quelques secondes.";
  const metaKeywords = keywords || "IA, branding, logo generator, entrepreneur assistant, brand identity, tech nova";
  const metaImage = image || "https://hacknova-gamma.vercel.app/og-image.png"; // Placeholder for OG image
  const metaUrl = url || "https://hacknova-gamma.vercel.app/";

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={metaUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />

      {/* Canonical Link */}
      <link rel="canonical" href={metaUrl} />
    </Helmet>
  );
};

export default SEO;
