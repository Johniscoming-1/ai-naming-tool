/**
 * 种子数据脚本 - 添加示例商品数据
 * 运行: node server/seed-data.mjs
 */

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

if (!process.env.DATABASE_URL) {
  console.error('❗ 错误: 未设置 DATABASE_URL 环境变量');
  process.exit(1);
}

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

const sampleProducts = [
  {
    platform: 'jd',
    productId: 'sample-1',
    productUrl: 'https://item.jd.com/100012345678.html',
    title: 'Apple iPhone 15 Pro Max 256GB 原色钛金属',
    imageUrl: 'https://img14.360buyimg.com/n1/s450x450_jfs/t1/placeholder.jpg',
    currentPrice: '9999.00',
    originalPrice: '10999.00',
    shop: 'Apple官方旗舰店',
    category: '手机通讯',
  },
  {
    platform: 'taobao',
    productId: 'sample-2',
    productUrl: 'https://item.taobao.com/item.htm?id=123456789',
    title: '小米14 Ultra 16GB+512GB 黑色 徕卡专业影像',
    imageUrl: 'https://img.alicdn.com/bao/uploaded/placeholder.jpg',
    currentPrice: '6499.00',
    originalPrice: '6999.00',
    shop: '小米官方旗舰店',
    category: '手机通讯',
  },
  {
    platform: 'jd',
    productId: 'sample-3',
    productUrl: 'https://item.jd.com/100012345679.html',
    title: 'HUAWEI Mate 60 Pro 12GB+512GB 雅川青',
    imageUrl: 'https://img14.360buyimg.com/n1/s450x450_jfs/t1/placeholder2.jpg',
    currentPrice: '6999.00',
    originalPrice: '7999.00',
    shop: '华为官方旗舰店',
    category: '手机通讯',
  },
  {
    platform: 'pinduoduo',
    productId: 'sample-4',
    productUrl: 'https://mobile.yangkeduo.com/goods.html?goods_id=123456',
    title: 'OPPO Find X7 Ultra 16GB+512GB 大漠银月',
    imageUrl: 'https://img.pddpic.com/placeholder.jpg',
    currentPrice: '5999.00',
    originalPrice: '6499.00',
    shop: 'OPPO官方旗舰店',
    category: '手机通讯',
  },
  {
    platform: 'jd',
    productId: 'sample-5',
    productUrl: 'https://item.jd.com/100012345680.html',
    title: 'vivo X100 Pro 16GB+512GB 落日橙',
    imageUrl: 'https://img14.360buyimg.com/n1/s450x450_jfs/t1/placeholder3.jpg',
    currentPrice: '5499.00',
    originalPrice: '5999.00',
    shop: 'vivo官方旗舰店',
    category: '手机通讯',
  },
  {
    platform: 'taobao',
    productId: 'sample-6',
    productUrl: 'https://item.taobao.com/item.htm?id=123456790',
    title: '荣耀Magic6 Pro 16GB+512GB 青山黛',
    imageUrl: 'https://img.alicdn.com/bao/uploaded/placeholder2.jpg',
    currentPrice: '5699.00',
    originalPrice: '6199.00',
    shop: '荣耀官方旗舰店',
    category: '手机通讯',
  },
  {
    platform: 'jd',
    productId: 'sample-7',
    productUrl: 'https://item.jd.com/100012345681.html',
    title: 'Apple MacBook Pro 14英寸 M3 Pro芯片 18GB+512GB',
    imageUrl: 'https://img14.360buyimg.com/n1/s450x450_jfs/t1/placeholder4.jpg',
    currentPrice: '15999.00',
    originalPrice: '17999.00',
    shop: 'Apple官方旗舰店',
    category: '电脑办公',
  },
  {
    platform: 'taobao',
    productId: 'sample-8',
    productUrl: 'https://item.taobao.com/item.htm?id=123456791',
    title: '联想ThinkPad X1 Carbon Gen 11 14英寸 i7 16GB+1TB',
    imageUrl: 'https://img.alicdn.com/bao/uploaded/placeholder3.jpg',
    currentPrice: '12999.00',
    originalPrice: '14999.00',
    shop: '联想官方旗舰店',
    category: '电脑办公',
  },
  {
    platform: 'jd',
    productId: 'sample-9',
    productUrl: 'https://item.jd.com/100012345682.html',
    title: 'AirPods Pro 2代 主动降噪 无线充电盒',
    imageUrl: 'https://img14.360buyimg.com/n1/s450x450_jfs/t1/placeholder5.jpg',
    currentPrice: '1899.00',
    originalPrice: '1999.00',
    shop: 'Apple官方旗舰店',
    category: '影音娱乐',
  },
  {
    platform: 'pinduoduo',
    productId: 'sample-10',
    productUrl: 'https://mobile.yangkeduo.com/goods.html?goods_id=123457',
    title: 'Sony WH-1000XM5 无线降噪耳机 黑色',
    imageUrl: 'https://img.pddpic.com/placeholder2.jpg',
    currentPrice: '2299.00',
    originalPrice: '2799.00',
    shop: 'Sony官方旗舰店',
    category: '影音娱乐',
  },
];

async function seedData() {
  console.log('开始添加示例商品数据...');
  
  try {
    for (const product of sampleProducts) {
      const [result] = await connection.execute(
        `INSERT INTO products (platform, productId, productUrl, title, imageUrl, currentPrice, originalPrice, shop, category) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [product.platform, product.productId, product.productUrl, product.title, product.imageUrl, 
         product.currentPrice, product.originalPrice, product.shop, product.category]
      );
      const productId = result.insertId;
      
      console.log(`✓ 已添加商品: ${product.title}`);
      
      // 为每个商品生成 30 天的历史价格数据
      const priceHistory = [];
      const currentPrice = parseFloat(product.currentPrice);
      const basePrice = currentPrice * 1.1; // 基准价格比当前价格高 10%
      
      for (let i = 30; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        // 生成波动价格
        const fluctuation = (Math.random() - 0.5) * 0.2; // ±10% 波动
        const price = (basePrice * (1 + fluctuation * (i / 30))).toFixed(2);
        
        priceHistory.push({
          productId,
          price,
          recordedAt: date,
        });
      }
      
      // 批量插入价格历史
      for (const history of priceHistory) {
        await connection.execute(
          `INSERT INTO price_history (productId, price, recordedAt) VALUES (?, ?, ?)`,
          [history.productId, history.price, history.recordedAt]
        );
      }
      console.log(`  ✓ 已添加 ${priceHistory.length} 条价格历史记录`);
    }
    
    console.log('\n✅ 示例数据添加完成！');
    console.log(`共添加 ${sampleProducts.length} 个商品`);
    
  } catch (error) {
    console.error('❌ 添加数据失败:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

seedData();
