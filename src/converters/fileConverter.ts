import { ErrorHandler } from '../helpers/errorHandler';
import { ConversionResult } from '../helpers/types';
import { normalizeFiletype } from '../helpers/normalizeFiletype';
import { properties } from './main';

export async function getConverter(fileType: string, convertTo: string, converterName?: string) {
  if (converterName && properties[converterName]?.converter) {
    return properties[converterName].converter;
  }

  // 遍历所有转换器查找合适的
  for (const [name, converter] of Object.entries(properties)) {
    for (const key in converter.properties.from) {
      if (
        converter.properties.from[key]?.includes(fileType) &&
        converter.properties.to[key]?.includes(convertTo)
      ) {
        return converter.converter;
      }
    }
  }
  
  return null;
}

export async function convertFile(
  inputFilePath: string,
  fileType: string,
  convertTo: string,
  targetPath: string,
  options?: unknown,
  converterName?: string,
): Promise<ConversionResult> {
  try {
    const normalizedFileType = normalizeFiletype(fileType);
    
    // 验证文件类型
    if (!normalizedFileType) {
      return {
        success: false,
        message: `Unsupported file type: ${fileType}`,
      };
    }

    // 获取转换器
    const converter = await getConverter(normalizedFileType, convertTo, converterName);
    if (!converter) {
      return {
        success: false,
        message: `No converter available for ${fileType} to ${convertTo} conversion`,
      };
    }

    // 执行转换
    const result = await converter(inputFilePath, normalizedFileType, convertTo, targetPath, options);
    
    return {
      success: true,
      message: `Successfully converted ${fileType} to ${convertTo}`,
    };
  } catch (error) {
    const conversionError = ErrorHandler.handleError(error, 'file_conversion');
    ErrorHandler.logError(conversionError);
    
    return {
      success: false,
      message: 'Conversion failed',
      error: conversionError,
    };
  }
}
