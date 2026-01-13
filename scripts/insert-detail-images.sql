-- Insert detail images for 떡뻥 (Tteok-ppeong) product
-- Product ID: 00000000-0000-0000-0000-000000000001

-- Delete existing detail images for this product (if any)
DELETE FROM product_images WHERE product_id = '00000000-0000-0000-0000-000000000001';

-- Insert new detail images
INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_thumbnail) VALUES
  (
    '00000000-0000-0000-0000-000000000001'::UUID,
    '/images/tteok_ppeong_detail_1_1768310860225.png',
    'Close-up of Korean organic rice crackers in baby hand',
    1,
    false
  ),
  (
    '00000000-0000-0000-0000-000000000001'::UUID,
    '/images/tteok_ppeong_detail_2_1768310879674.png',
    'Rice crackers on highchair tray with baby bib',
    2,
    false
  ),
  (
    '00000000-0000-0000-0000-000000000001'::UUID,
    '/images/tteok_ppeong_detail_3_1768310901230.png',
    'Korean rice crackers package with nutritional information',
    3,
    false
  );

-- Verify the images were inserted
SELECT p.name, pi.image_url, pi.sort_order 
FROM products p 
LEFT JOIN product_images pi ON p.id = pi.product_id 
WHERE p.id = '00000000-0000-0000-0000-000000000001'
ORDER BY pi.sort_order;
