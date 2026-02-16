-- Add status_snapshot column to registros table
ALTER TABLE public.registros 
ADD COLUMN IF NOT EXISTS status_snapshot text;

-- Comment on column
COMMENT ON COLUMN public.registros.status_snapshot IS 'Status of the visitor at the time of registration (e.g., ativo, bloqueado)';
