/**
 * Unit tests for question-generator.ts
 * 
 * Tests the dynamic generation of wizard questions from overlay configurations.
 */

import { describe, it, expect } from '@jest/globals';
import { generateQuestions, generateQuestionsForState } from '@/lib/question-generator';
import type { OverlayConfig } from '@/lib/config-loader/schemas';

describe('question-generator', () => {
  describe('generateQuestions', () => {
    it('should generate questions from fieldMapping configuration', () => {
      const overlay: OverlayConfig = {
        pdfPath: '/test.pdf',
        fieldMapping: {
          'seller_name': { fieldName: 'Sellers Printed Name' },
          'buyer_name': { fieldName: 'Purchasers Printed Name' },
          'year': { fieldName: 'Year' },
          'make': { fieldName: 'MakeManufacturer' },
          'vin': { fieldName: 'VehicleVessel Identification Number' },
          'price': { fieldName: 'Total Amount' },
          'sale_date': { fieldName: 'Date' }
        }
      };

      const questions = generateQuestions(overlay);

      expect(questions).toHaveLength(7);
      expect(questions[0]).toEqual({
        id: 'seller_name',
        label: 'Seller Name',
        type: 'text',
        required: true,
        tooltip: 'Enter the full legal name of the person or entity selling the vehicle.'
      });
      
      expect(questions[1]).toEqual({
        id: 'buyer_name',
        label: 'Buyer Name',
        type: 'text',
        required: true,
        tooltip: 'Enter the full legal name of the person or entity buying the vehicle.'
      });
    });

    it('should generate questions from coordinates configuration', () => {
      const overlay: OverlayConfig = {
        pdfPath: '/test.pdf',
        coordinates: {
          'seller_phone': { page: 0, x: 100, y: 200, fontSize: 10 },
          'county': { page: 0, x: 150, y: 250, fontSize: 10 }
        }
      };

      const questions = generateQuestions(overlay);

      expect(questions).toHaveLength(2);
      expect(questions[0]).toEqual({
        id: 'seller_phone',
        label: 'Seller Phone',
        type: 'tel',
        required: false,
        placeholder: '(XXX) XXX-XXXX'
      });
      
      const county = questions.find(q => q.id === 'county');
      expect(county).toBeDefined();
      expect(county?.required).toBe(true);
    });

    it('should handle Florida overlay configuration correctly', () => {
      const floridaOverlay: OverlayConfig = {
        pdfPath: '/public/forms/vehicle-bill-of-sale/florida/HSMV-82050.pdf',
        fieldMapping: {
          'seller_name': { fieldName: 'Sellers Printed Name' },
          'buyer_name': { fieldName: 'Purchasers Printed Name' },
          'year': { fieldName: 'Year' },
          'make': { fieldName: 'MakeManufacturer' },
          'model': { fieldName: 'Model' },
          'vin': { fieldName: 'VehicleVessel Identification Number' },
          'color': { fieldName: 'Color' },
          'body_type': { fieldName: 'Body Type' },
          'sale_date': { fieldName: 'Date' },
          'current_title_date': { fieldName: 'Current Title Issue Date' }
        },
        coordinates: {
          'seller_phone': { page: 0, x: 425, y: 618, fontSize: 10 },
          'buyer_phone': { page: 0, x: 425, y: 518, fontSize: 10 }
        }
      };

      const questions = generateQuestions(floridaOverlay);

      expect(questions.length).toBeGreaterThanOrEqual(10);
      expect(questions.some(q => q.id == 'seller_name')).toBe(true);
    });

    it('should detect input types correctly', () => {
      const overlay: OverlayConfig = {
        pdfPath: '/test.pdf',
        fieldMapping: {
          'sale_date': { fieldName: 'Sale Date' },
          'price': { fieldName: 'Price Amount' },
          'year': { fieldName: 'Vehicle Year' },
          'seller_phone': { fieldName: 'Phone Number' },
          'vin': { fieldName: 'VIN' },
          'as_is': { fieldName: 'As Is Sale' }
        }
      };

      const questions = generateQuestions(overlay);

      const dateQuestion = questions.find(q => q.id === 'sale_date');
      const priceQuestion = questions.find(q => q.id === 'price');
      const yearQuestion = questions.find(q => q.id === 'year');
      const phoneQuestion = questions.find(q => q.id === 'seller_phone');
      const vinQuestion = questions.find(q => q.id === 'vin');
      const booleanQuestion = questions.find(q => q.id === 'as_is');

      expect(dateQuestion?.type).toBe('date');
      expect(priceQuestion?.type).toBe('number');
      expect(yearQuestion?.type).toBe('text');
      expect(phoneQuestion?.type).toBe('tel');
      expect(vinQuestion?.type).toBe('text');
      expect(booleanQuestion?.type).toBe('boolean');
    });

    it('should generate select options for known field types', () => {
      const overlay: OverlayConfig = {
        pdfPath: '/test.pdf',
        fieldMapping: {
          'body_type': { fieldName: 'Body Type' },
          'odo_status': { fieldName: 'Odometer Status' },
          'payment_method': { fieldName: 'Payment Method' }
        }
      };

      const questions = generateQuestions(overlay);

      const bodyTypeQuestion = questions.find(q => q.id === 'body_type');
      const odoStatusQuestion = questions.find(q => q.id === 'odo_status');
      const paymentQuestion = questions.find(q => q.id === 'payment_method');

      expect(bodyTypeQuestion?.type).toBe('select');
      expect(bodyTypeQuestion?.options).toEqual(
        expect.arrayContaining([
          { value: 'Sedan', label: 'Sedan' },
          { value: 'SUV', label: 'SUV' },
          { value: 'Truck', label: 'Truck' }
        ])
      );

      expect(odoStatusQuestion?.type).toBe('select');
      expect(odoStatusQuestion?.options).toEqual([
        { value: 'ACTUAL', label: 'Actual Mileage' },
        { value: 'EXCEEDS', label: 'Exceeds Mechanical Limits' },
        { value: 'NOT_ACTUAL', label: 'Not Actual Mileage (Warning)' }
      ]);

      expect(paymentQuestion?.type).toBe('select');
      expect(paymentQuestion?.options).toEqual(
        expect.arrayContaining([
          { value: 'cash', label: 'Cash' },
          { value: 'check', label: 'Check' }
        ])
      );
    });

    it('should handle camelCase field names', () => {
      const overlay: OverlayConfig = {
        pdfPath: '/test.pdf',
        fieldMapping: {
          'vehicleVesselIdentificationNumber': { fieldName: 'VIN Field' },
          'currentTitleIssueDate': { fieldName: 'Title Date' }
        }
      };

      const questions = generateQuestions(overlay);

      const vinQuestion = questions.find(q => q.id === 'vehicleVesselIdentificationNumber');
      expect(vinQuestion).toBeDefined();
      expect(vinQuestion).toEqual(expect.objectContaining({
        id: 'vehicleVesselIdentificationNumber',
        label: 'Vehicle Vessel Identification Number',
        type: 'text'
      }));

      const titleDateQuestion = questions.find(q => q.id === 'currentTitleIssueDate');
      expect(titleDateQuestion).toBeDefined();
      expect(titleDateQuestion).toEqual(expect.objectContaining({
        id: 'currentTitleIssueDate',
        label: 'Current Title Issue Date',
        type: 'date'
      }));
    });

    it('should mark optional fields correctly', () => {
      const overlay: OverlayConfig = {
        pdfPath: '/test.pdf',
        fieldMapping: {
          'seller_name': { fieldName: 'Required Field' },
          'seller_phone': { fieldName: 'Optional Phone' },
          'county': { fieldName: 'Optional County' },
          'seller2_name': { fieldName: 'Second Seller' },
          'warranty_text': { fieldName: 'Optional Warranty' }
        }
      };

      const questions = generateQuestions(overlay);

      const sellerName = questions.find(q => q.id === 'seller_name');
      const sellerPhone = questions.find(q => q.id === 'seller_phone');
      const county = questions.find(q => q.id === 'county');
      const seller2Name = questions.find(q => q.id === 'seller2_name');
      const warrantyText = questions.find(q => q.id === 'warranty_text');

      expect(sellerName?.required).toBe(true);
      expect(sellerPhone?.required).toBe(false);
      expect(county?.required).toBe(true);
      expect(seller2Name?.required).toBe(true);
      expect(warrantyText?.required).toBe(false);
    });

    it('should sort fields in logical order', () => {
      const overlay: OverlayConfig = {
        pdfPath: '/test.pdf',
        fieldMapping: {
          'vin': { fieldName: 'VIN' },
          'seller_name': { fieldName: 'Seller' },
          'year': { fieldName: 'Year' },
          'state': { fieldName: 'State' },
          'buyer_name': { fieldName: 'Buyer' }
        }
      };

      const questions = generateQuestions(overlay);
      const questionIds = questions.map(q => q.id);

      // Should be sorted in logical form order
      expect(questionIds).toEqual(['state', 'seller_name', 'buyer_name', 'year', 'vin']);
    });
  });

  describe('generateQuestionsForState', () => {
    it('should make county required for notarization states', () => {
      const overlay: OverlayConfig = {
        pdfPath: '/test.pdf',
        coordinates: {
          'county': { page: 0, x: 100, y: 200, fontSize: 10 }
        }
      };

      const questionsFL = generateQuestionsForState(overlay, 'FL');
      const questionsCA = generateQuestionsForState(overlay, 'CA');

      const countyFL = questionsFL.find(q => q.id === 'county');
      const countyCA = questionsCA.find(q => q.id === 'county');

      expect(countyFL?.required).toBe(true);
      expect(countyFL?.tooltip).toBe('Required for notarization in FL');
      expect(countyCA?.required).toBe(true);
    });

    it('should return base questions when no state provided', () => {
      const overlay: OverlayConfig = {
        pdfPath: '/test.pdf',
        coordinates: {
          'county': { page: 0, x: 100, y: 200, fontSize: 10 }
        }
      };

      const baseQuestions = generateQuestions(overlay);
      const stateQuestions = generateQuestionsForState(overlay);

      expect(stateQuestions).toEqual(baseQuestions);
    });
  });

  describe('edge cases', () => {
    it('should handle empty overlay configuration', () => {
      const overlay: OverlayConfig = {
        pdfPath: '/test.pdf'
      };

      const questions = generateQuestions(overlay);

      expect(questions).toHaveLength(0);
    });

    it('should handle overlay with both fieldMapping and coordinates', () => {
      const overlay: OverlayConfig = {
        pdfPath: '/test.pdf',
        fieldMapping: {
          'seller_name': { fieldName: 'Seller Name' }
        },
        coordinates: {
          'seller_name': { page: 0, x: 100, y: 200, fontSize: 10 },
          'buyer_name': { page: 0, x: 150, y: 250, fontSize: 10 }
        }
      };

      const questions = generateQuestions(overlay);

      // Should prioritize fieldMapping and not duplicate
      expect(questions).toHaveLength(2);
      expect(questions.map(q => q.id)).toEqual(['seller_name', 'buyer_name']);
    });

    it('should generate placeholders for common field types', () => {
      const overlay: OverlayConfig = {
        pdfPath: '/test.pdf',
        fieldMapping: {
          'seller_phone': { fieldName: 'Phone' },
          'sale_date': { fieldName: 'Date' },
          'year': { fieldName: 'Year' },
          'vin': { fieldName: 'VIN' },
          'make': { fieldName: 'Make' }
        }
      };

      const questions = generateQuestions(overlay);

      expect(questions.find(q => q.id === 'seller_phone')?.placeholder).toBeDefined();
      expect(questions.find(q => q.id === 'sale_date')?.placeholder).toBe('MM/DD/YYYY');
      const yearPlaceholder = questions.find(q => q.id === 'year')?.placeholder;
      if (yearPlaceholder) {
        expect(yearPlaceholder).toBe('e.g., 2020');
      }
      const vinPlaceholder = questions.find(q => q.id === 'vin')?.placeholder;
      if (vinPlaceholder) {
        expect(vinPlaceholder).toBe('e.g., 1HGBH41JXMN109186');
      }
      const makePlaceholder = questions.find(q => q.id === 'make')?.placeholder;
      if (makePlaceholder) {
        expect(makePlaceholder).toBe('e.g., Toyota');
      }
    });
  });
});