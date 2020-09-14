class CreateTasks < ActiveRecord::Migration[6.0]
  def change
    create_table :tasks do |t|
      t.string :text
      t.date :deadline
      t.integer :priority

      t.timestamps
    end
  end
end
