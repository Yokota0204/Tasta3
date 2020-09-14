class Task < ApplicationRecord
  has_many :tag_task_connections, dependent: :destroy
  validates :text, :deadline, :priority, presence: true
end