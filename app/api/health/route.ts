import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  uptime: number;
  checks: {
    database: {
      status: 'up' | 'down';
      latency?: number;
      error?: string;
    };
    memory: {
      status: 'ok' | 'warning' | 'critical';
      usage: {
        heapUsed: number;
        heapTotal: number;
        external: number;
        rss: number;
      };
    };
  };
}

const startTime = Date.now();

export async function GET() {
  const timestamp = new Date().toISOString();
  const uptime = Math.floor((Date.now() - startTime) / 1000);
  
  // Check database connection
  let dbStatus: HealthStatus['checks']['database'] = { status: 'down' };
  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const dbLatency = Date.now() - dbStart;
    dbStatus = { status: 'up', latency: dbLatency };
  } catch (error) {
    dbStatus = { 
      status: 'down', 
      error: error instanceof Error ? error.message : 'Unknown database error' 
    };
  }

  // Check memory usage
  const memoryUsage = process.memoryUsage();
  const heapUsedMB = memoryUsage.heapUsed / 1024 / 1024;
  const heapTotalMB = memoryUsage.heapTotal / 1024 / 1024;
  const heapPercentage = (heapUsedMB / heapTotalMB) * 100;
  
  let memoryStatus: 'ok' | 'warning' | 'critical' = 'ok';
  if (heapPercentage > 90) {
    memoryStatus = 'critical';
  } else if (heapPercentage > 75) {
    memoryStatus = 'warning';
  }

  // Determine overall health status
  let overallStatus: HealthStatus['status'] = 'healthy';
  if (dbStatus.status === 'down') {
    overallStatus = 'unhealthy';
  } else if (memoryStatus === 'critical') {
    overallStatus = 'unhealthy';
  } else if (memoryStatus === 'warning') {
    overallStatus = 'degraded';
  }

  const healthStatus: HealthStatus = {
    status: overallStatus,
    timestamp,
    version: process.env.npm_package_version || '1.0.0',
    uptime,
    checks: {
      database: dbStatus,
      memory: {
        status: memoryStatus,
        usage: {
          heapUsed: Math.round(heapUsedMB * 100) / 100,
          heapTotal: Math.round(heapTotalMB * 100) / 100,
          external: Math.round(memoryUsage.external / 1024 / 1024 * 100) / 100,
          rss: Math.round(memoryUsage.rss / 1024 / 1024 * 100) / 100,
        },
      },
    },
  };

  // Return appropriate HTTP status code
  const httpStatus = overallStatus === 'healthy' ? 200 : overallStatus === 'degraded' ? 200 : 503;

  return NextResponse.json(healthStatus, { status: httpStatus });
}
