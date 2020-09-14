class TagTaskConnection < ApplicationRecord
  belongs_to :tag
  belongs_to :task
  validates :tag_id, :task_id, presence: true
end
