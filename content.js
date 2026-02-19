(function() {
  const selection = window.getSelection();
  if (selection.rangeCount === 0 || selection.isCollapsed) {
    alert("Please highlight some values in a table column first.");
    return;
  }

  const range = selection.getRangeAt(0);
  const startNode = range.startContainer.nodeType === 3 ? range.startContainer.parentElement : range.startContainer;
  const startCell = startNode.closest('td, th');

  if (!startCell) {
    alert("Selection must start inside a table cell.");
    return;
  }

  const targetColumnIndex = startCell.cellIndex;
  const table = startCell.closest('table');
  let total = 0;
  let isDate = false;
  let count = 0;

  // Grab all cells in that specific column
  const columnCells = table.querySelectorAll(`tr td:nth-child(${targetColumnIndex + 1}), tr th:nth-child(${targetColumnIndex + 1})`);
  
  columnCells.forEach(cell => {
    if (selection.containsNode(cell, true)) {
      let rawValue = cell.innerText.trim();
      
      // Clean finance/numbers: remove everything except digits, dots, and minus
      let cleanedValue = rawValue.replace(/[^\d.-]/g, '');
      let numericValue = parseFloat(cleanedValue);
      let dateValue = Date.parse(rawValue);
      
      if (!isNaN(dateValue) && isNaN(rawValue.charAt(0))) {
        total += dateValue;
        isDate = true;
        count++;
      } else if (!isNaN(numericValue)) {
        total += numericValue;
        count++;
      }
    }
  });

  if (count > 0) {
    let finalDisplay = isDate ? new Date(total).toLocaleString() : total.toLocaleString();
    alert(`Summing ${count} items from the selected column:\nTotal: ${finalDisplay}`);
  } else {
    alert("No valid data found in the selection.");
  }
})();
