# Core BIMI Conversion Library

This directory contains the core conversion and validation logic for BIMI logo processing.

## Purpose

These modules are framework-agnostic and can be used by:
- React frontend (current implementation)
- Backend API services
- CLI tools
- Other JavaScript/TypeScript applications

## Modules

- **types.ts**: Core TypeScript types and interfaces
- **svgValidate.ts**: BIMI validation rules and checks
- **svgNormalize.ts**: SVG normalization (background, padding, cleanup)
- **imageToSvg.ts**: Raster to vector conversion (with limitations)
- **index.ts**: Main API entry point

## Future Micro-SaaS Integration Points

When building a backend service, these functions can be wrapped with:

1. **Authentication**: Verify user identity before processing
2. **Usage Limits**: Track conversions per user/plan
3. **Rate Limiting**: Prevent abuse
4. **Analytics**: Log conversion metrics
5. **Caching**: Store frequently converted logos
6. **Batch Processing**: Process multiple files
7. **Quality Options**: Offer different vectorization quality tiers
8. **Storage**: Save user's converted logos to cloud storage

Example backend integration:

```typescript
// Backend API endpoint
app.post('/api/convert', authenticate, checkQuota, async (req, res) => {
  const file = req.file;
  const options = req.body;
  
  // Use core library
  const result = await convertToBimiSvg(file, options);
  
  // Track usage
  await trackUsage(req.user.id);
  
  // Optionally cache
  await cacheResult(file.hash, result);
  
  res.json(result);
});
```

## Limitations

- Browser-based vectorization is limited in quality
- For production-grade vectorization, consider server-side tools like Potrace
- Complex images may not convert perfectly

