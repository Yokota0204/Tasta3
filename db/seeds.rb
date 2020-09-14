# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

Tag.create(:title => '雑務', :status => 9)
Tag.create(:title => '佐賀大学情報掲示板', :status => 1)
Tag.create(:title => 'アフィリエイト', :status => 0)
Tag.create(:title => 'YouTube', :status => 2)

Task.create(:text => 'レイアウトの崩れを修正', :deadline => Date.new(2020, 9,30), :priority => 2)
Task.create(:text => 'バックエンドの実装', :deadline => Date.new(2020, 9,30), :priority => 2)
Task.create(:text => 'アカウント削除機能の実装', :deadline => Date.new(2020, 9,30), :priority => 2)
Task.create(:text => 'レスポンシブデザイン　タブレット', :deadline => Date.new(2020, 9,30), :priority => 0)
Task.create(:text => '家賃振り込み', :deadline => Date.new(2020, 9,3), :priority => 2)
Task.create(:text => 'お風呂の掃除', :deadline => Date.new(2020, 9,2), :priority => 2)
Task.create(:text => '仕様書作成', :deadline => Date.new(2020, 9,8), :priority => 2)

TagTaskConnection.create(:tag_id => 2, :task_id => 1)
TagTaskConnection.create(:tag_id => 2, :task_id => 2)
TagTaskConnection.create(:tag_id => 2, :task_id => 3)
TagTaskConnection.create(:tag_id => 2, :task_id => 4)
TagTaskConnection.create(:tag_id => 1, :task_id => 5)
TagTaskConnection.create(:tag_id => 1, :task_id => 6)
TagTaskConnection.create(:tag_id => 2, :task_id => 7)