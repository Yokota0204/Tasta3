json.tags @tags
json.newTaskTextItems do
  json.array! @tags do |tag|
    json.text ''
  end
end
json.newTaskDeadlineItems do
  json.array! @tags do |tag|
    json.deadline ''
  end
end
json.newTaskPriorityItems do
  json.array! @tags do |tag|
    json.selected 0
  end
end
json.checkedItems do
  json.array! @tasks do |task|
    json.checked false
  end
end