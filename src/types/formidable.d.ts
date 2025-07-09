// src/types/formidable.d.ts

declare module 'formidable' {
  import { IncomingMessage } from 'http'
  import { EventEmitter } from 'events'

  export interface File {
    /** path ke file di disk setelah upload */
    filepath: string
    /** nama file asli (opsional) */
    originalFilename?: string
    /** nama file baru setelah disimpan (opsional) */
    newFilename?: string
    /** mime type (opsional) */
    mimetype?: string
    /** ukuran file dalam byte (opsional) */
    size?: number
  }

  export interface IncomingFormOptions {
    uploadDir?: string
    keepExtensions?: boolean
    maxFileSize?: number
  }

  export class IncomingForm extends EventEmitter {
    constructor(options?: IncomingFormOptions)
    parse(
      req: IncomingMessage,
      callback: (
        err: any,
        fields: { [key: string]: string | string[] },
        files: { [key: string]: File | File[] }
      ) => void
    ): void
    on(event: 'fileBegin', listener: (name: string, file: File) => void): this
    on(event: 'error', listener: (err: any) => void): this
    on(event: 'progress' | 'end', listener: () => void): this
  }
}
