const express = require('express');
const cors = require('cors');
const diff = require('diff');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// 3-Way Merge endpoint
app.post('/api/merge', (req, res) => {
  const { baseCode, mainCode, featureCode } = req.body;

  if (typeof baseCode !== 'string' || typeof mainCode !== 'string' || typeof featureCode !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid baseCode, mainCode, or featureCode in payload.' });
  }

  try {
    // Perform 3-way merge using jsdiff
    const diff3 = diff.merge(mainCode, featureCode, baseCode);
    const baseLines = baseCode.split('\n');
    let mergedLines = [];
    let baseIndex = 0;
    let hasConflict = false;

    for (const hunk of diff3.hunks || []) {
      const hunkStart = hunk.oldStart - 1; 

      // Add unchanged lines before this hunk
      while (baseIndex < hunkStart) {
        mergedLines.push(baseLines[baseIndex]);
        baseIndex++;
      }

      // Process hunk lines
      for (const line of hunk.lines) {
        if (typeof line === 'string') {
          const type = line[0];
          const content = line.substring(1);
          if (type === ' ' || type === '+') {
            mergedLines.push(content);
          }
        } else if (typeof line === 'object' && line.conflict) {
          hasConflict = true;
          mergedLines.push('<<<<<<< HEAD');
          
          for (const mLine of line.mine) {
            if (mLine[0] === '+' || mLine[0] === ' ') {
              mergedLines.push(mLine.substring(1));
            }
          }
          
          mergedLines.push('=======');
          
          for (const tLine of line.theirs) {
            if (tLine[0] === '+' || tLine[0] === ' ') {
              mergedLines.push(tLine.substring(1));
            }
          }
          
          mergedLines.push('>>>>>>> incoming-feature');
        }
      }

      // Advance baseIndex past this hunk
      baseIndex = hunkStart + hunk.oldLines;
    }

    // Add remaining unchanged lines
    while (baseIndex < baseLines.length) {
      mergedLines.push(baseLines[baseIndex]);
      baseIndex++;
    }

    const mergedCode = mergedLines.join('\n');

    res.status(200).json({
      status: hasConflict ? 'conflict' : 'success',
      hasConflict,
      mergedCode
    });

  } catch (error) {
    console.error('Merge Error:', error);
    res.status(500).json({ error: 'Internal server error during merge process.' });
  }
});

app.listen(PORT, () => {
  console.log(`MergeMate API listening on port ${PORT}`);
});
