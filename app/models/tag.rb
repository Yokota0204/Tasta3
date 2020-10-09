class Tag < ApplicationRecord
  has_many :tag_task_connections, dependent: :destroy
  validates :title, :status, presence: true

  def process
    tags = Tag.all.order(status: "DESC")
    tasks = Task.all
    tags_hash = []
    tags.each do |tag|
      tag_hash = tag.attributes
      tag_hash["emergency"] = 0
      tag_hash["tasks"] = []
      deadCount = 0
      todayCount = 0
      emerCount = 0
      tag.tag_task_connections.each do |connection|
        task = tasks.find(connection.task_id).attributes
        if task["deadline"]
          task["limit"] = (task["deadline"] - Date.today).to_i
        else
          task["limit"] = nil
        end
        if task["limit"] != nil
          if task["limit"] < 0
            deadCount += 1
          elsif task["limit"] == 0
            todayCount += 1
          elsif task["limit"] <= 3
            emerCount += 1
          end
        end
        task["checked"] = false
        tag_hash["tasks"] << task
      end
      tag_hash["tasks"] = tag_hash["tasks"].sort_by do |v|
        [-v["priority"], v["id"]]
      end
      if deadCount > 0 then
        tag_hash["emergency"] = 3
      elsif todayCount > 0
        tag_hash["emergency"] = 2
      elsif emerCount > 0
        tag_hash["emergency"] = 1
      end
      tag_hash["errors"] = {
        text: "",
        # deadline: "",
        priority: ""
      }
      tags_hash << tag_hash
    end
    return tags_hash
  end
end
