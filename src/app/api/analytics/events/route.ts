// Event streaming API for BigQuery and real-time analytics
// Enhanced with Google Pub/Sub integration for better scalability
import { NextRequest, NextResponse } from 'next/server';
import { pubsubAnalytics } from '@/lib/pubsub-analytics';

// BigQuery streaming configuration
const BIGQUERY_PROJECT_ID =
  process.env.BIGQUERY_PROJECT_ID || 'your-project-id';
const BIGQUERY_DATASET_ID = process.env.BIGQUERY_DATASET_ID || 'analytics';
const BIGQUERY_TABLE_ID = process.env.BIGQUERY_TABLE_ID || 'events';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, properties, sessionId, timestamp } = body;

    if (!event || !sessionId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: event, sessionId',
        },
        { status: 400 },
      );
    }

    // Prepare event data for BigQuery
    const eventData = {
      event_id: generateEventId(),
      event_name: event,
      session_id: sessionId,
      user_id: properties.userId,
      device_id: properties.deviceId,
      timestamp: timestamp || new Date().toISOString(),

      // User properties
      user_properties: {
        country: properties.country,
        state: properties.state,
        city: properties.city,
        device_type: properties.device,
        browser: properties.browser,
        os: properties.os,
        referrer: properties.referrer,
        utm_source: properties.utm_source,
        utm_medium: properties.utm_medium,
        utm_campaign: properties.utm_campaign,
      },

      // Event properties
      event_properties: {
        page_path: properties.page_path,
        page_title: properties.page_title,
        document_type: properties.documentType,
        form_name: properties.formName,
        field_name: properties.fieldName,
        error_type: properties.errorType,
        error_message: properties.errorMessage,
        value: properties.value,
        step: properties.step,
        time_on_page: properties.timeOnPage,
        scroll_depth: properties.scrollDepth,
        click_count: properties.clickCount,
        form_interactions: properties.formInteractions,
      },

      // Technical properties
      technical_properties: {
        user_agent: request.headers.get('user-agent'),
        ip_address: getClientIP(request),
        screen_resolution: properties.screenResolution,
        viewport_size: properties.viewportSize,
        page_load_time: properties.pageLoadTime,
        connection_type: properties.connectionType,
      },

      // Calculated fields
      created_at: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      hour: new Date().getHours(),
    };

    // Stream to Pub/Sub first (if enabled), then BigQuery as fallback
    const pubsubSuccess = await pubsubAnalytics.streamAnalyticsEvent({
      eventName: event,
      sessionId,
      userId: properties.userId,
      deviceId: properties.deviceId,
      timestamp: timestamp || new Date().toISOString(),
      userProperties: eventData.user_properties,
      eventProperties: eventData.event_properties,
      technicalProperties: eventData.technical_properties,
    });

    // Fallback to direct BigQuery streaming if Pub/Sub fails
    if (!pubsubSuccess) {
      await streamToBigQuery(eventData);
    }

    // Also store locally for real-time analytics
    await storeEventLocally(eventData);

    return NextResponse.json({
      success: true,
      data: {
        event_id: eventData.event_id,
        streamed_via_pubsub: pubsubSuccess,
        streamed_to_bigquery: !pubsubSuccess,
      },
    });
  } catch (error) {
    console.error('Event streaming error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to stream event',
      },
      { status: 500 },
    );
  }
}

// Batch event upload
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { events } = body;

    if (!Array.isArray(events) || events.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Events array is required',
        },
        { status: 400 },
      );
    }

    const processedEvents = events.map((event) => ({
      event_id: generateEventId(),
      ...event,
      created_at: new Date().toISOString(),
      user_agent: request.headers.get('user-agent'),
      ip_address: getClientIP(request),
    }));

    // Batch stream to BigQuery
    await batchStreamToBigQuery(processedEvents);

    return NextResponse.json({
      success: true,
      data: {
        events_processed: processedEvents.length,
        streamed_to_bigquery: true,
      },
    });
  } catch (error) {
    console.error('Batch event streaming error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to stream batch events',
      },
      { status: 500 },
    );
  }
}

// BigQuery streaming functions
async function streamToBigQuery(eventData: any): Promise<void> {
  try {
    // In production, use the actual BigQuery client library
    // const { BigQuery } = require('@google-cloud/bigquery');
    // const bigquery = new BigQuery({ projectId: BIGQUERY_PROJECT_ID });

    // For now, log the data that would be streamed
    console.log('Streaming to BigQuery:', {
      project: BIGQUERY_PROJECT_ID,
      dataset: BIGQUERY_DATASET_ID,
      table: BIGQUERY_TABLE_ID,
      data: eventData,
    });

    // Simulate BigQuery streaming
    await simulateBigQueryInsert(eventData);
  } catch (error) {
    console.error('BigQuery streaming error:', error);
    throw error;
  }
}

async function batchStreamToBigQuery(events: any[]): Promise<void> {
  try {
    console.log('Batch streaming to BigQuery:', {
      project: BIGQUERY_PROJECT_ID,
      dataset: BIGQUERY_DATASET_ID,
      table: BIGQUERY_TABLE_ID,
      batch_size: events.length,
      events: events,
    });

    // Simulate batch insert
    await simulateBigQueryBatchInsert(events);
  } catch (error) {
    console.error('BigQuery batch streaming error:', error);
    throw error;
  }
}

// Local storage for real-time analytics
async function storeEventLocally(eventData: any): Promise<void> {
  try {
    // In production, store in Redis or fast database
    // For demo, we'll use memory storage

    if (typeof window !== 'undefined') {
      const events = JSON.parse(
        localStorage.getItem('analytics_events') || '[]',
      );
      events.push(eventData);

      // Keep only last 1000 events
      if (events.length > 1000) {
        events.splice(0, events.length - 1000);
      }

      localStorage.setItem('analytics_events', JSON.stringify(events));
    }
  } catch (error) {
    console.error('Local event storage error:', error);
  }
}

// Simulation functions for BigQuery
async function simulateBigQueryInsert(_data: any): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate network delay
      resolve();
    }, 50);
  });
}

async function simulateBigQueryBatchInsert(_events: any[]): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate batch processing delay
      resolve();
    }, 100);
  });
}

// Utility functions
function generateEventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');

  if (cfConnectingIp) return cfConnectingIp;
  if (forwarded) return forwarded.split(',')[0];
  if (realIp) return realIp;

  return 'unknown';
}

// BigQuery schema for reference
/*
CREATE TABLE `your-project.analytics.events` (
  event_id STRING NOT NULL,
  event_name STRING NOT NULL,
  session_id STRING NOT NULL,
  user_id STRING,
  device_id STRING,
  timestamp TIMESTAMP NOT NULL,
  
  user_properties STRUCT<
    country STRING,
    state STRING,
    city STRING,
    device_type STRING,
    browser STRING,
    os STRING,
    referrer STRING,
    utm_source STRING,
    utm_medium STRING,
    utm_campaign STRING
  >,
  
  event_properties STRUCT<
    page_path STRING,
    page_title STRING,
    document_type STRING,
    form_name STRING,
    field_name STRING,
    error_type STRING,
    error_message STRING,
    value NUMERIC,
    step STRING,
    time_on_page NUMERIC,
    scroll_depth NUMERIC,
    click_count INT64,
    form_interactions INT64
  >,
  
  technical_properties STRUCT<
    user_agent STRING,
    ip_address STRING,
    screen_resolution STRING,
    viewport_size STRING,
    page_load_time NUMERIC,
    connection_type STRING
  >,
  
  created_at TIMESTAMP NOT NULL,
  date DATE NOT NULL,
  hour INT64 NOT NULL
)
PARTITION BY date
CLUSTER BY event_name, session_id;
*/
