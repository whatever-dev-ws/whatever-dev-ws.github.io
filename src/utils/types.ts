export type Sketch = {
  id: string;
  author: string;
  filename: string;
  uploadedAt: string;
};

export type Output = {
  id: string;
  sketchId: string;
  filename: string;
  createdAt: string;
};

export type Manifest = {
  sketches: Sketch[];
  outputs: Output[];
};
